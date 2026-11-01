const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "library.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log("Server running on port ${PORT}");
    });
  } catch (error) {
    console.error(`Database Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/books/", async (request, response) => {
  const books = await db.all("SELECT * FROM book ORDER BY id;");
  response.status(200).send(books);
});

app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const book = await db.get("SELECT * FROM book WHERE id = ?;", bookId);

  if (!book) {
    response.status(404).send({ error: "Book not found" });
  } else {
    response.status(200).send(book);
  }
});

app.post("/books/", async (request, response) => {
  const { title, author, price, pages } = request.body;

  if (title === undefined || author === undefined ||
      price === undefined || pages === undefined) {
    return response.status(400).send({
      error: "title, author, price and pages are required",
    });
  }

  const result = await db.run(
    `INSERT INTO book (title, author, price, pages)
     VALUES (?, ?, ?, ?);`,
    [title, author, price, pages]
  );

  response.status(201).send({
    message: "Book added successfully",
    bookId: result.lastID,
  });
});

app.put("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const { title, author, price, pages } = request.body;

  if (title === undefined || author === undefined ||
      price === undefined || pages === undefined) {
    return response.status(400).send({
      error: "title, author, price and pages are required",
    });
  }

  const result = await db.run(
    `UPDATE book
     SET title = ?, author = ?, price = ?, pages = ?
     WHERE id = ?;`,
    [title, author, price, pages, bookId]
  );

  if (result.changes === 0) {
    response.status(404).send({ error: "Book not found" });
  } else {
    response.status(200).send({ message: "Book updated successfully" });
  }
});

app.delete("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const result = await db.run("DELETE FROM book WHERE id = ?;", bookId);

  if (result.changes === 0) {
    response.status(404).send({ error: "Book not found" });
  } else {
    response.status(200).send({ message: "Book deleted successfully" });
  }
});

