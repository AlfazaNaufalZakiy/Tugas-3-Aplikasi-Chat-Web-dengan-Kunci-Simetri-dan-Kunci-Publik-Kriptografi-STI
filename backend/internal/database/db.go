package database

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func Connect() {
	var err error
	DB, err = sql.Open("sqlite3", "./chat.db")
	if err != nil {
		log.Fatal(err)
	}

	createTables()
}

func createTables() {
	query := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT UNIQUE,
		password_hash TEXT,
		password_salt TEXT,
		public_key TEXT,
		encrypted_private_key TEXT,
		kdf_salt TEXT,
		private_key_iv TEXT
	);
	CREATE TABLE IF NOT EXISTS contacts (
		user_id INTEGER,
		contact_id INTEGER,
		PRIMARY KEY (user_id, contact_id),
		FOREIGN KEY(user_id) REFERENCES users(id),
		FOREIGN KEY(contact_id) REFERENCES users(id)
	);
	CREATE TABLE IF NOT EXISTS messages (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		sender_email TEXT,
		receiver_email TEXT,
		ciphertext TEXT,
		iv TEXT,
		mac TEXT,
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	`
	_, err := DB.Exec(query)
	if err != nil {
		log.Fatal(err)
	}

	migrations := []string{
		"ALTER TABLE users ADD COLUMN email TEXT",
		"ALTER TABLE users ADD COLUMN password_hash TEXT",
		"ALTER TABLE users ADD COLUMN password_salt TEXT",
		"ALTER TABLE users ADD COLUMN encrypted_private_key TEXT",
		"ALTER TABLE users ADD COLUMN kdf_salt TEXT",
		"ALTER TABLE users ADD COLUMN private_key_iv TEXT",
		"ALTER TABLE messages ADD COLUMN sender_email TEXT",
		"ALTER TABLE messages ADD COLUMN receiver_email TEXT",
		"ALTER TABLE messages ADD COLUMN ciphertext TEXT",
		"ALTER TABLE messages ADD COLUMN iv TEXT",
		"ALTER TABLE messages ADD COLUMN mac TEXT",
	}
	for _, stmt := range migrations {
		_, _ = DB.Exec(stmt)
	}
}
