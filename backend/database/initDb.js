"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConnection = getDatabaseConnection;
const sqlite3 = require("sqlite3").verbose();
let db;
function getDatabaseConnection() {
    if (!db) {
        db = new sqlite3.Database("./database.db", (err) => {
            if (err) {
                console.error("Error opening database:", err.message);
            }
            else {
                console.log("Connected to SQLite database.");
                initializeDatabase();
            }
        });
    }
    return db;
}
function initializeDatabase() {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      webid TEXT UNIQUE NOT NULL,
      read_d BOOLEAN NOT NULL DEFAULT 0,
      write_d BOOLEAN NOT NULL DEFAULT 0,
      read_o BOOLEAN NOT NULL DEFAULT 0,
      write_o BOOLEAN NOT NULL DEFAULT 0,
      isactive BOOLEAN NOT NULL DEFAULT 0
    )`, (err) => {
        if (err) {
            console.error("Error creating table:", err.message);
        }
        else {
            console.log('Table "users" created or already exists.');
        }
    });
}
