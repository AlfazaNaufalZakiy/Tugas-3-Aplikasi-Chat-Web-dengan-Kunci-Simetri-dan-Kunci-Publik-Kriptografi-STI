export interface RegistrationKeys {
  publicKey: string;
  encryptedPrivateKey: string;
  kdfSalt: string;
  privateKeyIv: string;
}

export interface EncryptedMessagePayload {
  ciphertext: string;
  iv: string;
  mac: string;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const generateRegistrationKeys = async (password: string): Promise<RegistrationKeys> => {
  const keyPair = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"]
  );
  const publicJwk = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
  const privateJwk = await crypto.subtle.exportKey("jwk", keyPair.privateKey);
  const kdfSalt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const passwordKey = await derivePrivateKeyEncryptionKey(password, kdfSalt);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    passwordKey,
    encoder.encode(JSON.stringify(privateJwk))
  );

  return {
    publicKey: encodeJson(publicJwk),
    encryptedPrivateKey: bytesToBase64(new Uint8Array(encrypted)),
    kdfSalt: bytesToBase64(kdfSalt),
    privateKeyIv: bytesToBase64(iv),
  };
};

export const decryptStoredPrivateKey = async (
  password: string,
  encryptedPrivateKey: string,
  kdfSalt: string,
  privateKeyIv: string
): Promise<CryptoKey> => {
  const passwordKey = await derivePrivateKeyEncryptionKey(password, base64ToBytes(kdfSalt));
  const privateJwkBytes = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: toArrayBuffer(base64ToBytes(privateKeyIv)) },
    passwordKey,
    toArrayBuffer(base64ToBytes(encryptedPrivateKey))
  );
  return crypto.subtle.importKey(
    "jwk",
    JSON.parse(decoder.decode(privateJwkBytes)),
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"]
  );
};

export const exportSessionPrivateKey = async (privateKey: CryptoKey): Promise<string> => {
  const jwk = await crypto.subtle.exportKey("jwk", privateKey);
  return encodeJson(jwk);
};

export const importSessionPrivateKey = async (value: string): Promise<CryptoKey> => {
  return crypto.subtle.importKey(
    "jwk",
    decodeJson<JsonWebKey>(value),
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"]
  );
};

export const encryptMessage = async (
  text: string,
  recipientPublicKey: string,
  senderPrivateKey: CryptoKey,
  senderEmail: string,
  receiverEmail: string
): Promise<EncryptedMessagePayload> => {
  const { aesKey, macKey } = await deriveConversationKeys(senderPrivateKey, recipientPublicKey, senderEmail, receiverEmail);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, aesKey, encoder.encode(text));
  const payload = {
    ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
    iv: bytesToBase64(iv),
    mac: "",
  };
  payload.mac = await signMac(macKey, payload.iv, payload.ciphertext, senderEmail, receiverEmail);
  return payload;
};

export const decryptMessage = async (
  payload: EncryptedMessagePayload,
  myPrivateKey: CryptoKey,
  otherPartyPublicKey: string,
  senderEmail: string,
  receiverEmail: string
): Promise<string> => {
  const { aesKey, macKey } = await deriveConversationKeys(myPrivateKey, otherPartyPublicKey, senderEmail, receiverEmail);
  const expectedMac = await signMac(macKey, payload.iv, payload.ciphertext, senderEmail, receiverEmail);
  if (expectedMac !== payload.mac) {
    throw new Error("Message MAC is invalid");
  }
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: toArrayBuffer(base64ToBytes(payload.iv)) },
    aesKey,
    toArrayBuffer(base64ToBytes(payload.ciphertext))
  );
  return decoder.decode(decrypted);
};

export const setSession = async (email: string, privateKey: CryptoKey, publicKey: string, token: string): Promise<void> => {
  sessionStorage.setItem("currentUser", email);
  sessionStorage.setItem("currentPrivateKey", await exportSessionPrivateKey(privateKey));
  sessionStorage.setItem("currentPublicKey", publicKey);
  sessionStorage.setItem("sessionToken", token);
};

export const getCurrentUser = (): string | null => sessionStorage.getItem("currentUser");

export const getCurrentUserKeyPair = async (): Promise<{ privateKey: CryptoKey; publicKey: string } | null> => {
  const privateKey = sessionStorage.getItem("currentPrivateKey");
  const publicKey = sessionStorage.getItem("currentPublicKey");
  if (!privateKey || !publicKey) return null;
  return { privateKey: await importSessionPrivateKey(privateKey), publicKey };
};

export const clearUserSession = (): void => {
  sessionStorage.removeItem("currentUser");
  sessionStorage.removeItem("currentPrivateKey");
  sessionStorage.removeItem("currentPublicKey");
  sessionStorage.removeItem("sessionToken");
};

const derivePrivateKeyEncryptionKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
  const baseKey = await crypto.subtle.importKey("raw", toArrayBuffer(encoder.encode(password)), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: toArrayBuffer(salt), iterations: 250000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

const deriveConversationKeys = async (
  privateKey: CryptoKey,
  publicKeyValue: string,
  firstEmail: string,
  secondEmail: string
): Promise<{ aesKey: CryptoKey; macKey: CryptoKey }> => {
  const publicKey = await crypto.subtle.importKey(
    "jwk",
    decodeJson<JsonWebKey>(publicKeyValue),
    { name: "ECDH", namedCurve: "P-256" },
    false,
    []
  );
  const sharedSecret = await crypto.subtle.deriveBits({ name: "ECDH", public: publicKey }, privateKey, 256);
  const saltText = [firstEmail, secondEmail].sort().join("|");
  const hkdfKey = await crypto.subtle.importKey("raw", sharedSecret, "HKDF", false, ["deriveKey"]);
  const aesKey = await crypto.subtle.deriveKey(
    {
      name: "HKDF",
      salt: toArrayBuffer(encoder.encode(saltText)),
      info: toArrayBuffer(encoder.encode("ii4021-chat-aes")),
      hash: "SHA-256",
    },
    hkdfKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
  const macKey = await crypto.subtle.deriveKey(
    {
      name: "HKDF",
      salt: toArrayBuffer(encoder.encode(saltText)),
      info: toArrayBuffer(encoder.encode("ii4021-chat-mac")),
      hash: "SHA-256",
    },
    hkdfKey,
    { name: "HMAC", hash: "SHA-256", length: 256 },
    false,
    ["sign", "verify"]
  );
  return { aesKey, macKey };
};

const signMac = async (
  macKey: CryptoKey,
  iv: string,
  ciphertext: string,
  senderEmail: string,
  receiverEmail: string
): Promise<string> => {
  const data = `${senderEmail}.${receiverEmail}.${iv}.${ciphertext}`;
  const signature = await crypto.subtle.sign("HMAC", macKey, encoder.encode(data));
  return bytesToBase64(new Uint8Array(signature));
};

const encodeJson = (value: unknown): string => bytesToBase64(encoder.encode(JSON.stringify(value)));

const decodeJson = <T>(value: string): T => JSON.parse(decoder.decode(base64ToBytes(value)));

const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const base64ToBytes = (value: string): Uint8Array => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer => {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
};
