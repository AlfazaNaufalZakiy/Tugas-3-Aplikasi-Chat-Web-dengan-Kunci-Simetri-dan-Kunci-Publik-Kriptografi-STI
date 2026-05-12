package handlers

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"time"

	"ii4021-tugas-3/backend/internal/authkeys"
	"ii4021-tugas-3/backend/internal/database"
	"ii4021-tugas-3/backend/pkg/jwtlib"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *fiber.Ctx) error {
	type Request struct {
		Email               string `json:"email"`
		Password            string `json:"password"`
		PublicKey           string `json:"publicKey"`
		EncryptedPrivateKey string `json:"encryptedPrivateKey"`
		KdfSalt             string `json:"kdfSalt"`
		PrivateKeyIV        string `json:"privateKeyIv"`
	}
	var req Request
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}
	if req.Email == "" || req.Password == "" || req.PublicKey == "" || req.EncryptedPrivateKey == "" || req.KdfSalt == "" || req.PrivateKeyIV == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Email, password, and key material are required"})
	}

	var existingID int
	err := database.DB.QueryRow("SELECT id FROM users WHERE email = ?", req.Email).Scan(&existingID)
	if err == nil {
		return c.Status(409).JSON(fiber.Map{"error": "This email address is already registered."})
	}
	if err != sql.ErrNoRows {
		return c.Status(500).JSON(fiber.Map{"error": "Could not check email availability"})
	}

	passwordSalt, err := randomHex(16)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not generate password salt"})
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(passwordSalt+req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not hash password"})
	}

	result, err := database.DB.Exec(`
		INSERT INTO users (email, password_hash, password_salt, public_key, encrypted_private_key, kdf_salt, private_key_iv)
		VALUES (?, ?, ?, ?, ?, ?, ?)`,
		req.Email, string(hash), passwordSalt, req.PublicKey, req.EncryptedPrivateKey, req.KdfSalt, req.PrivateKeyIV)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not register user"})
	}

	id, _ := result.LastInsertId()
	return c.JSON(fiber.Map{"status": "User registered", "userId": id})
}

func Login(c *fiber.Ctx) error {
	type Request struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	var req Request
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	var id int
	var passwordHash, passwordSalt, publicKey, encryptedPrivateKey, kdfSalt, privateKeyIV string
	err := database.DB.QueryRow(`
		SELECT id, password_hash, password_salt, public_key, encrypted_private_key, kdf_salt, private_key_iv
		FROM users WHERE email = ?`, req.Email).
		Scan(&id, &passwordHash, &passwordSalt, &publicKey, &encryptedPrivateKey, &kdfSalt, &privateKeyIV)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid email or password"})
	}
	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(passwordSalt+req.Password)); err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid email or password"})
	}

	now := time.Now().Unix()
	token, err := jwtlib.Sign(
		jwtlib.Header{Alg: "ES256", Typ: "JWT"},
		jwtlib.Claims{
			"iss":   "ii4021-tugas-3",
			"sub":   req.Email,
			"aud":   "secure-chat",
			"iat":   now,
			"nbf":   now,
			"exp":   time.Now().Add(72 * time.Hour).Unix(),
			"jti":   mustRandomHex(16),
			"email": req.Email,
		},
		jwtlib.Payload{},
		authkeys.PrivatePEM,
	)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not issue JWT"})
	}

	return c.JSON(fiber.Map{
		"token":               token,
		"email":               req.Email,
		"publicKey":           publicKey,
		"encryptedPrivateKey": encryptedPrivateKey,
		"kdfSalt":             kdfSalt,
		"privateKeyIv":        privateKeyIV,
	})
}

func randomHex(size int) (string, error) {
	bytes := make([]byte, size)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

func mustRandomHex(size int) string {
	value, err := randomHex(size)
	if err != nil {
		return "fallback"
	}
	return value
}
