const sqlite3 = require("sqlite3").verbose();

let db: any;

export function getDatabaseConnection() {
  if (!db) {
    db = new sqlite3.Database("./database.db", (err: any) => {
      if (err) {
        console.error("Error opening database:", err.message);
      } else {
        console.log("Connected to SQLite database.");
        initializeDatabase();
      }
    });
  }
  return db;
}

function initializeDatabase() {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      webid TEXT UNIQUE NOT NULL,
      read_d BOOLEAN NOT NULL DEFAULT 0,
      write_d BOOLEAN NOT NULL DEFAULT 0,
      read_o BOOLEAN NOT NULL DEFAULT 0,
      write_o BOOLEAN NOT NULL DEFAULT 0,
      isactive BOOLEAN NOT NULL DEFAULT 0
    )`,
    (err: any) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log('Table "users" created or already exists.');
      }
    }
  );
}
