// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const READ_FILE = path.join(DATA_DIR, 'books-read.json');
const TOREAD_FILE = path.join(DATA_DIR, 'books-to-read.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(READ_FILE)) fs.writeFileSync(READ_FILE, '[]');
if (!fs.existsSync(TOREAD_FILE)) fs.writeFileSync(TOREAD_FILE, '[]');

// Helper function to load and save
function loadData(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Routes

// GET books
app.get('/books-read', (req, res) => {
  const data = loadData(READ_FILE);
  res.json(data);
});

app.get('/books-to-read', (req, res) => {
  const data = loadData(TOREAD_FILE);
  res.json(data);
});

// PUT (update or insert)
app.put('/books-read', (req, res) => {
  const newBook = req.body;
  let books = loadData(READ_FILE);

  const index = books.findIndex(
    (b) => b.title === newBook.title && b.author === newBook.author
  );

  if (index !== -1) {
    books[index] = { ...books[index], ...newBook };
  } else {
    books.push(newBook);
  }

  saveData(READ_FILE, books);
  res.json({ success: true });
});

app.put('/books-to-read', (req, res) => {
  const newBook = req.body;
  let books = loadData(TOREAD_FILE);

  const index = books.findIndex(
    (b) => b.title === newBook.title && b.author === newBook.author
  );

  if (index !== -1) {
    books[index] = { ...books[index], ...newBook };
  } else {
    books.push(newBook);
  }

  saveData(TOREAD_FILE, books);
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`Book API server running on http://localhost:${PORT}`);
});

