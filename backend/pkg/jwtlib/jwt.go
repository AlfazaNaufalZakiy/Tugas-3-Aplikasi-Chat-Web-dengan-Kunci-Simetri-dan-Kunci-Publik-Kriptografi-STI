package jwtlib

import (
	"crypto"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/sha256"
	"crypto/sha512"
	"encoding/base64"
	"encoding/json"
	"encoding/pem"
	"errors"
	"fmt"
	"math/big"
	"strings"
	"time"

	"crypto/x509"
)

type Header struct {
	Alg string `json:"alg"`
	Typ string `json:"typ"`
}

type Claims map[string]any
type Payload map[string]any

type VerifyOptions struct {
	Algs      []string
	Iss       string
	Sub       string
	Aud       string
	IgnoreExp bool
	IgnoreNbf bool
	JTI       string
}

type DecodedJWT struct {
	Header    Header  `json:"header"`
	Payload   Payload `json:"payload"`
	Signature string  `json:"signature"`
}

func Sign(header Header, claims Claims, payload Payload, privateKeyPEM string) (string, error) {
	if header.Typ != "JWT" {
		return "", errors.New("JWT header typ must be JWT")
	}
	hashFn, size, err := algParams(header.Alg)
	if err != nil {
		return "", err
	}

	merged := Payload{}
	for k, v := range payload {
		merged[k] = v
	}
	for k, v := range claims {
		merged[k] = v
	}

	key, err := parsePrivateKey(privateKeyPEM)
	if err != nil {
		return "", err
	}
	if key.Curve.Params().BitSize != curveBits(header.Alg) {
		return "", fmt.Errorf("%s requires a matching ECDSA private key", header.Alg)
	}

	headerJSON, err := json.Marshal(header)
	if err != nil {
		return "", err
	}
	payloadJSON, err := json.Marshal(merged)
	if err != nil {
		return "", err
	}

	signingInput := base64.RawURLEncoding.EncodeToString(headerJSON) + "." + base64.RawURLEncoding.EncodeToString(payloadJSON)
	digest := digestFor(hashFn, []byte(signingInput))
	r, s, err := ecdsa.Sign(rand.Reader, key, digest)
	if err != nil {
		return "", err
	}

	signature := append(leftPad(r.Bytes(), size), leftPad(s.Bytes(), size)...)
	return signingInput + "." + base64.RawURLEncoding.EncodeToString(signature), nil
}

func Verify(token string, publicKeyPEM string, options VerifyOptions) (DecodedJWT, error) {
	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		return DecodedJWT{}, errors.New("JWT must contain header, payload, and signature")
	}

	var header Header
	headerBytes, err := base64.RawURLEncoding.DecodeString(parts[0])
	if err != nil {
		return DecodedJWT{}, errors.New("invalid JWT header encoding")
	}
	if err := json.Unmarshal(headerBytes, &header); err != nil {
		return DecodedJWT{}, errors.New("invalid JWT header JSON")
	}
	hashFn, size, err := algParams(header.Alg)
	if err != nil {
		return DecodedJWT{}, err
	}
	if len(options.Algs) > 0 && !contains(options.Algs, header.Alg) {
		return DecodedJWT{}, errors.New("JWT algorithm is not allowed")
	}

	payloadBytes, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return DecodedJWT{}, errors.New("invalid JWT payload encoding")
	}
	var payload Payload
	if err := json.Unmarshal(payloadBytes, &payload); err != nil {
		return DecodedJWT{}, errors.New("invalid JWT payload JSON")
	}

	signature, err := base64.RawURLEncoding.DecodeString(parts[2])
	if err != nil {
		return DecodedJWT{}, errors.New("invalid JWT signature encoding")
	}
	if len(signature) != size*2 {
		return DecodedJWT{}, errors.New("invalid JWT signature length")
	}

	key, err := parsePublicKey(publicKeyPEM)
	if err != nil {
		return DecodedJWT{}, err
	}
	digest := digestFor(hashFn, []byte(parts[0]+"."+parts[1]))
	r := new(big.Int).SetBytes(signature[:size])
	s := new(big.Int).SetBytes(signature[size:])
	if !ecdsa.Verify(key, digest, r, s) {
		return DecodedJWT{}, errors.New("invalid JWT signature")
	}

	if err := validatePayload(payload, options); err != nil {
		return DecodedJWT{}, err
	}
	return DecodedJWT{Header: header, Payload: payload, Signature: parts[2]}, nil
}

func algParams(alg string) (crypto.Hash, int, error) {
	switch alg {
	case "ES256":
		return crypto.SHA256, 32, nil
	case "ES384":
		return crypto.SHA384, 48, nil
	case "ES512":
		return crypto.SHA512, 66, nil
	default:
		return 0, 0, errors.New("unsupported JWT algorithm")
	}
}

func curveBits(alg string) int {
	if alg == "ES384" {
		return elliptic.P384().Params().BitSize
	}
	if alg == "ES512" {
		return elliptic.P521().Params().BitSize
	}
	return elliptic.P256().Params().BitSize
}

func digestFor(hashFn crypto.Hash, input []byte) []byte {
	switch hashFn {
	case crypto.SHA384:
		sum := sha512.Sum384(input)
		return sum[:]
	case crypto.SHA512:
		sum := sha512.Sum512(input)
		return sum[:]
	default:
		sum := sha256.Sum256(input)
		return sum[:]
	}
}

func parsePrivateKey(privateKeyPEM string) (*ecdsa.PrivateKey, error) {
	block, _ := pem.Decode([]byte(privateKeyPEM))
	if block == nil {
		return nil, errors.New("invalid private key PEM")
	}
	key, err := x509.ParseECPrivateKey(block.Bytes)
	if err == nil {
		return key, nil
	}
	parsed, err := x509.ParsePKCS8PrivateKey(block.Bytes)
	if err != nil {
		return nil, errors.New("invalid ECDSA private key")
	}
	ecdsaKey, ok := parsed.(*ecdsa.PrivateKey)
	if !ok {
		return nil, errors.New("private key is not ECDSA")
	}
	return ecdsaKey, nil
}

func parsePublicKey(publicKeyPEM string) (*ecdsa.PublicKey, error) {
	block, _ := pem.Decode([]byte(publicKeyPEM))
	if block == nil {
		return nil, errors.New("invalid public key PEM")
	}
	parsed, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		return nil, errors.New("invalid ECDSA public key")
	}
	key, ok := parsed.(*ecdsa.PublicKey)
	if !ok {
		return nil, errors.New("public key is not ECDSA")
	}
	return key, nil
}

func validatePayload(payload Payload, options VerifyOptions) error {
	now := time.Now().Unix()
	if !options.IgnoreExp {
		if exp, ok := numericDate(payload["exp"]); ok && now >= exp {
			return errors.New("JWT is expired")
		}
	}
	if !options.IgnoreNbf {
		if nbf, ok := numericDate(payload["nbf"]); ok && now < nbf {
			return errors.New("JWT is not valid yet")
		}
	}
	if options.Iss != "" && payload["iss"] != options.Iss {
		return errors.New("JWT issuer does not match")
	}
	if options.Sub != "" && payload["sub"] != options.Sub {
		return errors.New("JWT subject does not match")
	}
	if options.Aud != "" && payload["aud"] != options.Aud {
		return errors.New("JWT audience does not match")
	}
	if options.JTI != "" && payload["jti"] != options.JTI {
		return errors.New("JWT id does not match")
	}
	return nil
}

func numericDate(value any) (int64, bool) {
	switch v := value.(type) {
	case float64:
		return int64(v), true
	case int64:
		return v, true
	case int:
		return int64(v), true
	default:
		return 0, false
	}
}

func leftPad(input []byte, size int) []byte {
	if len(input) >= size {
		return input
	}
	out := make([]byte, size)
	copy(out[size-len(input):], input)
	return out
}

func contains(values []string, target string) bool {
	for _, value := range values {
		if value == target {
			return true
		}
	}
	return false
}
