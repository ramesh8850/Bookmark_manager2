import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();


const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use Render's connection string
  ssl: {
    rejectUnauthorized: false, // Required for Render's PostgreSQL
  },
});

// Test database connection
pool.connect()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ Database connection error:", err));

export default pool;