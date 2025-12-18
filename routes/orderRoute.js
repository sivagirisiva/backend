const express = require("express");
const Order = require("../models/Order");
const Book = require("../models/Book");
const auth = require("../middleware/auth");

const router = express.Router();

// Create order
router.post("/", auth, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (let item of items) {
      const book = await Book.findById(item.bookId);
      if (!book) {
        return res.status(404).json({ message: `Book not found: ${item.bookId}` });
      }
      
      if (book.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${book.title}` });
      }

      const itemTotal = book.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        book: book._id,
        quantity: item.quantity,
        price: book.price
      });

      // Update stock
      book.stock -= item.quantity;
      await book.save();
    }

    const order = new Order({
      user: req.userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod
    });

    await order.save();
    await order.populate('items.book', 'title author image');

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Order creation failed" });
  }
});

// Get user orders
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('items.book', 'title author image')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Get order by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    }).populate('items.book', 'title author image');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

module.exports = router;