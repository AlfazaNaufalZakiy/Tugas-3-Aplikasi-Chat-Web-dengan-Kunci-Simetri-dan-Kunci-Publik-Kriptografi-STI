package handlers

import (
	"ii4021-tugas-3/backend/internal/database"
	"ii4021-tugas-3/backend/internal/models"

	"github.com/gofiber/fiber/v2"
)

func SendMessage(c *fiber.Ctx) error {
	email := c.Locals("email").(string)
	var msg models.Message
	if err := c.BodyParser(&msg); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}
	if msg.SenderEmail != email {
		return c.Status(403).JSON(fiber.Map{"error": "Sender does not match authenticated user"})
	}
	if msg.ReceiverEmail == "" || msg.Ciphertext == "" || msg.IV == "" || msg.MAC == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Encrypted message payload is incomplete"})
	}

	_, err := database.DB.Exec(`
		INSERT INTO messages (sender_email, receiver_email, ciphertext, iv, mac, timestamp)
		VALUES (?, ?, ?, ?, ?, ?)`,
		msg.SenderEmail, msg.ReceiverEmail, msg.Ciphertext, msg.IV, msg.MAC, msg.Timestamp)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Could not save message"})
	}

	return c.JSON(fiber.Map{"status": "Message sent"})
}

func GetMessages(c *fiber.Ctx) error {
	email := c.Locals("email").(string)
	contactEmail := c.Query("contact")

	rows, err := database.DB.Query(`
		SELECT id, sender_email, receiver_email, ciphertext, iv, mac, timestamp
		FROM messages
		WHERE (sender_email = ? AND receiver_email = ?)
		OR (sender_email = ? AND receiver_email = ?)
		ORDER BY timestamp ASC`,
		email, contactEmail, contactEmail, email)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}
	defer rows.Close()

	var messages []models.Message
	for rows.Next() {
		var msg models.Message
		if err := rows.Scan(&msg.ID, &msg.SenderEmail, &msg.ReceiverEmail, &msg.Ciphertext, &msg.IV, &msg.MAC, &msg.Timestamp); err != nil {
			continue
		}
		messages = append(messages, msg)
	}

	return c.JSON(messages)
}
