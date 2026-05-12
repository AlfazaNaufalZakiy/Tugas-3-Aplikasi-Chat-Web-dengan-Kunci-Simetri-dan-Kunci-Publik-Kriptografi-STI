package models

type User struct {
	ID                  int    `json:"id"`
	Email               string `json:"email"`
	PublicKey           string `json:"publicKey"`
	EncryptedPrivateKey string `json:"encryptedPrivateKey,omitempty"`
	KdfSalt             string `json:"kdfSalt,omitempty"`
	PrivateKeyIV        string `json:"privateKeyIv,omitempty"`
}

type Contact struct {
	ID        int    `json:"id"`
	Email     string `json:"email"`
	PublicKey string `json:"publicKey"`
}

type Message struct {
	ID            int    `json:"id"`
	SenderEmail   string `json:"sender_email"`
	ReceiverEmail string `json:"receiver_email"`
	Ciphertext    string `json:"ciphertext"`
	IV            string `json:"iv"`
	MAC           string `json:"mac"`
	Timestamp     string `json:"timestamp"`
}
