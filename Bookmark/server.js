import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON requests

// **Create a new bookmark**
app.post("/bookmarks", async (req, res) => {
  try {
    const { title, url, description, category } = req.body;
    const result = await pool.query(
      "INSERT INTO bookmarks (title, url, description, category) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, url, description, category]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// **Get all bookmarks**
app.get("/bookmarks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bookmarks ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// **Update a bookmark**
app.put("/bookmarks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, description, category } = req.body;
    await pool.query(
      "UPDATE bookmarks SET title = $1, url = $2, description = $3, category = $4 WHERE id = $5",
      [title, url, description, category, id]
    );
    res.send("Bookmark updated");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// **Delete a bookmark**
app.delete("/bookmarks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM bookmarks WHERE id = $1", [id]);
    res.send("Bookmark deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
