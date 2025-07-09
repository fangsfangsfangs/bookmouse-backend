// bookmouse-backend/server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_PATH = path.join(__dirname, "data", "books-read.json");

// Enable CORS with default settings (allows all origins)
app.use(cors());

app.use(express.json());

// GET all books
app.get("/books/read", (req, res) => {
  const data = fs.readFileSync(DATA_PATH, "utf8");
  res.json(JSON.parse(data));
});

// POST new book
app.post("/books/read", (req, res) => {
  const newBook = req.body;
  const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  data.push(newBook);
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  res.status(201).json(newBook);
});

// PUT to update a book by title_author in the URL
app.put("/books/read/:id", (req, res) => {
  const updatedBook = req.body;
  const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

  const [rawTitle, rawAuthor] = req.params.id.split("_");
  const title = decodeURIComponent(rawTitle);
  const author = decodeURIComponent(rawAuthor);

  const index = data.findIndex(
    (b) => b.title === title && b.author === author
  );

  if (index !== -1) {
    data[index] = updatedBook;
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    res.json(updatedBook);
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
