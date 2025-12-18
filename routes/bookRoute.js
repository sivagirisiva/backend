const express = require("express");
const Book = require("../models/Book");

const router = express.Router();

// GET all books with search and filter
router.get("/", async (req, res) => {
  try {
    const { search, genre, sort, page = 1, limit = 10 } = req.query;
    let query = {};

    // Search by title or author
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by genre
    if (genre) {
      query.genre = genre;
    }

    let sortOption = {};
    if (sort === 'price-low') sortOption.price = 1;
    else if (sort === 'price-high') sortOption.price = -1;
    else if (sort === 'rating') sortOption.rating = -1;
    else sortOption.createdAt = -1;

    const books = await Book.find(query)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Book.countDocuments(query);

    res.json({
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(404).json({ message: "Book not found" });
  }
});

// GET books by genre
router.get("/genre/:genre", async (req, res) => {
  try {
    const books = await Book.find({ genre: req.params.genre });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ADD book
router.post("/", async (req, res) => {
  try {
    const { title, author, price, image, description } = req.body;

    if (!title || !author || !price || !image || !description) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const book = new Book(req.body);
    await book.save();

    res.status(201).json(book);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "ISBN already exists" });
    } else {
      res.status(500).json({ message: "Error adding book" });
    }
  }
});

// UPDATE book
router.put("/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});

// DELETE book
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
