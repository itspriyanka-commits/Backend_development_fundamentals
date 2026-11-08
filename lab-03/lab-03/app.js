const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;
const dbPath = path.join(__dirname, "library.db");

let db;

// Keep the allowed sort columns in a fixed list.
// Never insert a query parameter directly into an SQL statement.
const allowedSortColumns = ["id", "title", "author", "price", "pages"];

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const isValidPositiveInteger = (value) =>
  Number.isInteger(value) && value > 0;

const asyncHandler = (handler) => (request, response, next) => {
  Promise.resolve(handler(request, response, next)).catch(next);
};

// Health route
app.get("/", (request, response) => {
  response.status(200).json({ message: "Books REST API is running" });
});

// GET /books supports search, sorting, pagination and price filtering.
app.get("/books", asyncHandler(async (request, response) => {
  const {
    search_q = "",
    order_by = "id",
    order = "ASC",
    limit = "10",
    offset = "0",
    min_price,
    max_price,
  } = request.query;

  const sortColumn = String(order_by).toLowerCase();
  const sortOrder = String(order).toUpperCase();
  const pageLimit = Number(limit);
  const pageOffset = Number(offset);

  if (!allowedSortColumns.includes(sortColumn)) {
    return response.status(400).json({
      message: "Invalid order_by. Use id, title, author, price or pages.",
    });
  }

  if (!["ASC", "DESC"].includes(sortOrder)) {
    return response.status(400).json({
      message: "Invalid order. Use ASC or DESC.",
    });
  }

  if (!Number.isInteger(pageLimit) || pageLimit < 1 || pageLimit > 100) {
    return response.status(400).json({
      message: "limit must be an integer between 1 and 100.",
    });
  }

  if (!Number.isInteger(pageOffset) || pageOffset < 0) {
    return response.status(400).json({
      message: "offset must be a non-negative integer.",
    });
  }

  const conditions = [];
  const values = [];

  if (search_q.trim() !== "") {
    conditions.push("title LIKE ?");
    values.push(`%${search_q.trim()}%`);
  }

  if (min_price !== undefined) {
    const minPrice = Number(min_price);
    if (!Number.isFinite(minPrice) || minPrice < 0) {
      return response.status(400).json({
        message: "min_price must be a non-negative number.",
      });
    }
    conditions.push("price >= ?");
    values.push(minPrice);
  }

  if (max_price !== undefined) {
    const maxPrice = Number(max_price);
    if (!Number.isFinite(maxPrice) || maxPrice < 0) {
      return response.status(400).json({
        message: "max_price must be a non-negative number.",
      });
    }
    conditions.push("price <= ?");
    values.push(maxPrice);
  }

  if (min_price !== undefined && max_price !== undefined &&
      Number(min_price) > Number(max_price)) {
    return response.status(400).json({
      message: "min_price cannot be greater than max_price.",
    });
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const sql = `
    SELECT * FROM book
    ${whereClause}
    ORDER BY ${sortColumn} ${sortOrder}
    LIMIT ? OFFSET ?;
  `;

  const books = await db.all(sql, [...values, pageLimit, pageOffset]);

  response.status(200).json({
    message: "Books fetched successfully",
    count: books.length,
    books,
  });
}));

// GET /books/:id
app.get("/books/:id", asyncHandler(async (request, response) => {
  const bookId = Number(request.params.id);

  if (!isValidPositiveInteger(bookId)) {
    return response.status(400).json({ message: "Book id must be a positive integer." });
  }

  const book = await db.get("SELECT * FROM book WHERE id = ?;", [bookId]);

  if (!book) {
    return response.status(404).json({ message: "Book not found." });
  }

  response.status(200).json({ message: "Book fetched successfully", book });
}));

// POST /books
app.post("/books", asyncHandler(async (request, response) => {
  const { title, author, price, pages = 0 } = request.body || {};

  if (!isNonEmptyString(title)) {
    return response.status(400).json({ message: "title is required and must be a non-empty string." });
  }
  if (!isNonEmptyString(author)) {
    return response.status(400).json({ message: "author is required and must be a non-empty string." });
  }
  if (price === undefined || price === null || price === "" ||
      !Number.isFinite(Number(price)) || Number(price) < 0) {
    return response.status(400).json({ message: "price is required and must be a non-negative number." });
  }
  if (!Number.isInteger(Number(pages)) || Number(pages) < 0) {
    return response.status(400).json({ message: "pages must be a non-negative integer." });
  }

  const result = await db.run(
    `INSERT INTO book (title, author, price, pages)
     VALUES (?, ?, ?, ?);`,
    [title.trim(), author.trim(), Number(price), Number(pages)]
  );

  const createdBook = await db.get("SELECT * FROM book WHERE id = ?;", [result.lastID]);

  response.status(201).json({
    message: "Book created successfully",
    book: createdBook,
  });
}));

// PUT /books/:id
app.put("/books/:id", asyncHandler(async (request, response) => {
  const bookId = Number(request.params.id);
  const { title, author, price, pages = 0 } = request.body || {};

  if (!isValidPositiveInteger(bookId)) {
    return response.status(400).json({ message: "Book id must be a positive integer." });
  }
  if (!isNonEmptyString(title)) {
    return response.status(400).json({ message: "title is required and must be a non-empty string." });
  }
  if (!isNonEmptyString(author)) {
    return response.status(400).json({ message: "author is required and must be a non-empty string." });
  }
  if (price === undefined || price === null || price === "" ||
      !Number.isFinite(Number(price)) || Number(price) < 0) {
    return response.status(400).json({ message: "price is required and must be a non-negative number." });
  }
  if (!Number.isInteger(Number(pages)) || Number(pages) < 0) {
    return response.status(400).json({ message: "pages must be a non-negative integer." });
  }

  const result = await db.run(
    `UPDATE book
     SET title = ?, author = ?, price = ?, pages = ?
     WHERE id = ?;`,
    [title.trim(), author.trim(), Number(price), Number(pages), bookId]
  );

  if (result.changes === 0) {
    return response.status(404).json({ message: "Book not found." });
  }

  const updatedBook = await db.get("SELECT * FROM book WHERE id = ?;", [bookId]);
  response.status(200).json({
    message: "Book updated successfully",
    book: updatedBook,
  });
}));

// DELETE /books/:id
app.delete("/books/:id", asyncHandler(async (request, response) => {
  const bookId = Number(request.params.id);

  if (!isValidPositiveInteger(bookId)) {
    return response.status(400).json({ message: "Book id must be a positive integer." });
  }

  const result = await db.run("DELETE FROM book WHERE id = ?;", [bookId]);

  if (result.changes === 0) {
    return response.status(404).json({ message: "Book not found." });
  }

  response.status(200).json({ message: "Book deleted successfully" });
}));

// Unknown routes return a consistent JSON response.
app.use((request, response) => {
  response.status(404).json({ message: "Endpoint not found." });
});

// Central error handler. Avoid exposing internal error details to clients.
app.use((error, request, response, next) => {
  console.error("API error:", error.message);
  response.status(500).json({ message: "Internal server error." });
});

async function startServer() {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(PORT, () => {
      console.log(`Books REST API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
