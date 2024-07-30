const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DB_URI,
});

async function checkUsernameExists(username) {
  try {
    const query = `
      SELECT 1 FROM users
      WHERE username = $1
      LIMIT 1
    `;
    const values = [username];
    const { rowCount } = await pool.query(query, values);
    return rowCount > 0;
  } catch (error) {
    console.error("Error checking username existence:", error);
    throw error;
  }
}

async function addUser(firstName, lastName, username, password) {
  try {
    const query = `
      INSERT INTO users (first_name, last_name, username, password)
      VALUES ($1, $2, $3, $4)
    `;
    const values = [firstName, lastName, username, password];
    await pool.query(query, values);
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
}

async function getUser(method, value) {
  try {
    let query;
    const values = [value];

    switch (method) {
      case "id":
        query = `
          SELECT * FROM users
          WHERE id = $1
        `;
        break;
      case "username":
        query = `
          SELECT * FROM users
          WHERE username = $1
        `;
        break;
      default:
        throw new Error("Invalid method. Use 'id' or 'username'.");
    }

    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
}

async function updateMembershipStatus(userId) {
  try {
    const query = `
    UPDATE users
    SET membership_status = $1 
    WHERE id = $2
    `;
    const values = ["member", userId];
    await pool.query(query, values);
  } catch (error) {
    console.error("Error updating membership status:", error);
    throw error;
  }
}

async function addMessage(title, text, userId) {
  try {
    const query = `
    INSERT INTO messages (title, text, user_id)
    VALUES ($1, $2, $3)`;
    const values = [title, text, userId];
    await pool.query(query, values);
  } catch (error) {
    console.error("Error adding message:", error);
    throw error;
  }
}

async function getAllMessages() {
  try {
    const query = `
      SELECT messages.title, messages.text, messages.created_at, users.username
      FROM messages
      JOIN users ON messages.user_id = users.id`;
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error("Error getting all messages:", error);
    throw error;
  }
}

async function updateIsAdmin(userId) {
  try {
    const query = `
    UPDATE users
    SET is_admin = true 
    WHERE id = $1
    `;
    const values = [userId];
    await pool.query(query, values);
  } catch (error) {
    console.error("Error updating membership status:", error);
    throw error;
  }
}

module.exports = {
  checkUsernameExists,
  addUser,
  getUser,
  pool,
  updateMembershipStatus,
  addMessage,
  getAllMessages,
  updateIsAdmin,
};
