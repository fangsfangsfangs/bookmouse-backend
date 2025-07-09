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

// Serve JSON files from /data path
app.use("/data", express.static(dataDir));

// --- Helper functions ---
async function readJSON(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

async function writeJSON(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// --- GET Routes ---
app.get("/books/read", async (req, res) => {
  const books = await readJSON(booksReadPath);
  res.json(books);
});

app.get("/books/to-read", async (req, res) => {
  const books = await readJSON(booksToReadPath);
  res.json(books);
});

// --- POST Routes (overwrite all books) ---
app.post("/books/read", async (req, res) => {
  await writeJSON(booksReadPath, req.body);
  res.json({ success: true });
});

app.post("/books/to-read", async (req, res) => {
  await writeJSON(booksToReadPath, req.body);
  res.json({ success: true });
});

// --- PUT Routes (update a single book by title + author) ---
app.put("/books/read", async (req, res) => {
  const updatedBook = req.body;

  if (!updatedBook.title || !updatedBook.author) {
    return res.status(400).json({ error: "Missing title or author." });
  }

  const books = await readJSON(booksReadPath);
  const index = books.findIndex(
    (b) =>
      b.title.toLowerCase() === updatedBook.title.toLowerCase() &&
      b.author.toLowerCase() === updatedBook.author.toLowerCase()
  );

  if (index === -1) {
    return res.status(404).json({ error: "Book not found." });
  }

  books[index] = { ...books[index], ...updatedBook };
  await writeJSON(booksReadPath, books);

  res.json({ success: true, updated: books[index] });
});

app.put("/books/to-read", async (req, res) => {
  const updatedBook = req.body;

  if (!updatedBook.title || !updatedBook.author) {
    return res.status(400).json({ error: "Missing title or author." });
  }

  const books = await readJSON(booksToReadPath);
  const index = books.findIndex(
    (b) =>
      b.title.toLowerCase() === updatedBook.title.toLowerCase() &&
      b.author.toLowerCase() === updatedBook.author.toLowerCase()
  );

  if (index === -1) {
    return res.status(404).json({ error: "Book not found." });
  }

  books[index] = { ...books[index], ...updatedBook };
  await writeJSON(booksToReadPath, books);

  res.json({ success: true, updated: books[index] });
});

// --- POST Routes to Add New Book Without Overwrite ---
app.post("/books/read/add", async (req, res) => {
  const newBook = req.body;

  if (!newBook.title || !newBook.author) {
    return res.status(400).json({ error: "Missing title or author." });
  }

  const books = await readJSON(booksReadPath);

  const exists = books.some(
    (b) =>
      b.title.toLowerCase() === newBook.title.toLowerCase() &&
      b.author.toLowerCase() === newBook.author.toLowerCase()
  );

  if (exists) {
    return res.status(409).json({ error: "Book already exists." });
  }

  books.push(newBook);
  await writeJSON(booksReadPath, books);

  res.json({ success: true, added: newBook });
});

app.post("/books/to-read/add", async (req, res) => {
  const newBook = req.body;

  if (!newBook.title || !newBook.author) {
    return res.status(400).json({ error: "Missing title or author." });
  }

  const books = await readJSON(booksToReadPath);

  const exists = books.some(
    (b) =>
      b.title.toLowerCase() === newBook.title.toLowerCase() &&
      b.author.toLowerCase() === newBook.author.toLowerCase()
  );

  if (exists) {
    return res.status(409).json({ error: "Book already exists." });
  }

  books.push(newBook);
  await writeJSON(booksToReadPath, books);

  res.json({ success: true, added: newBook });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`📚 Bookmouse backend running on port ${PORT}`);
});
