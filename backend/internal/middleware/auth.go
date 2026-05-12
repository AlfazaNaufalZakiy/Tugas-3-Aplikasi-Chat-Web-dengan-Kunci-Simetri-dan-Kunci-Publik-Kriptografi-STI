package middleware

import (
	"strings"

	"ii4021-tugas-3/backend/internal/authkeys"
	"ii4021-tugas-3/backend/pkg/jwtlib"

	"github.com/gofiber/fiber/v2"
)

func Protected() fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
		}

		tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
		decoded, err := jwtlib.Verify(tokenString, authkeys.PublicPEM, jwtlib.VerifyOptions{
			Algs: []string{"ES256"},
			Iss:  "ii4021-tugas-3",
			Aud:  "secure-chat",
		})
		if err != nil {
			return c.Status(401).JSON(fiber.Map{"error": "Invalid token"})
		}

		email, ok := decoded.Payload["email"].(string)
		if !ok || email == "" {
			email, _ = decoded.Payload["sub"].(string)
		}
		c.Locals("email", email)

		return c.Next()
	}
}
