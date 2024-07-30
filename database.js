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

module.exports = {
  checkUsernameExists,
  addUser,
  getUser,
  pool,
  updateMembershipStatus,
};
