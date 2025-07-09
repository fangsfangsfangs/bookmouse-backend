// bookmouse-backend/server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_PATH = path.join(__dirname, "data", "books-read.json");

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

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

// PUT to replace an existing book (by title + author match)
app.put("/books/read", (req, res) => {
  const updatedBook = req.body;
  const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  const index = data.findIndex(
    (b) => b.title === updatedBook.title && b.author === updatedBook.author
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
