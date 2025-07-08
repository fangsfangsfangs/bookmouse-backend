import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

const dataDir = path.resolve("./data");
const booksReadPath = path.join(dataDir, "books-read.json");
const booksToReadPath = path.join(dataDir, "books-to-read.json");

app.use(cors());
app.use(express.json());

// Helper to read JSON file safely
async function readJSON(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

// Helper to write JSON file
async function writeJSON(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// GET read books
app.get("/books/read", async (req, res) => {
  const books = await readJSON(booksReadPath);
  res.json(books);
});

// GET to-read books
app.get("/books/to-read", async (req, res) => {
  const books = await readJSON(booksToReadPath);
  res.json(books);
});

// POST update read books (overwrite)
app.post("/books/read", async (req, res) => {
  await writeJSON(booksReadPath, req.body);
  res.json({ success: true });
});

// POST update to-read books (overwrite)
app.post("/books/to-read", async (req, res) => {
  await writeJSON(booksToReadPath, req.body);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Bookmouse backend running on port ${PORT}`);
});
