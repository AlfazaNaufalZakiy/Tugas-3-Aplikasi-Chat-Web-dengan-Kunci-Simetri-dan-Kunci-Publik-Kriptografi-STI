package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"ii4021-tugas-3/backend/internal/authkeys"
	"ii4021-tugas-3/backend/internal/database"
	"ii4021-tugas-3/backend/internal/handlers"
	"ii4021-tugas-3/backend/internal/middleware"
)

func main() {
	// 1. Connect to Database
	database.Connect()
	authkeys.Init()

	// 2. Initialize Fiber
	app := fiber.New()

	// 3. Middleware
	app.Use(logger.New())
	app.Use(cors.New())

	// 4. Routes
	auth := app.Group("/auth")
	auth.Post("/register", handlers.Register)
	auth.Post("/login", handlers.Login)

	api := app.Group("/api", middleware.Protected())

	// Contacts
	api.Get("/contacts", handlers.GetContacts)
	api.Get("/users/search", handlers.SearchUsers)

	// Chat
	api.Post("/chat/send", handlers.SendMessage)
	api.Get("/chat/history", handlers.GetMessages)

	// 5. Start Server
	app.Listen(":3000")
}
