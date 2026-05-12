package handlers

import (
	"ii4021-tugas-3/backend/internal/database"
	"ii4021-tugas-3/backend/internal/models"

	"github.com/gofiber/fiber/v2"
)

func GetContacts(c *fiber.Ctx) error {
	email := c.Locals("email").(string)

	rows, err := database.DB.Query("SELECT id, email, public_key FROM users WHERE email <> ? ORDER BY email ASC", email)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}
	defer rows.Close()

	var contacts []models.Contact
	for rows.Next() {
		var contact models.Contact
		if err := rows.Scan(&contact.ID, &contact.Email, &contact.PublicKey); err != nil {
			continue
		}
		contacts = append(contacts, contact)
	}

	return c.JSON(contacts)
}

func SearchUsers(c *fiber.Ctx) error {
	query := c.Query("q")
	email := c.Locals("email").(string)
	if query == "" {
		return c.JSON([]models.User{})
	}

	rows, err := database.DB.Query("SELECT id, email, public_key FROM users WHERE email LIKE ? AND email <> ?", "%"+query+"%", email)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var user models.User
		if err := rows.Scan(&user.ID, &user.Email, &user.PublicKey); err != nil {
			continue
		}
		users = append(users, user)
	}
	return c.JSON(users)
}
