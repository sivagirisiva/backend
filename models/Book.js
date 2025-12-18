// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   name: {type: String, required: true},
//   price: {type: String, required: true},
//   image: String,
//   description: {type: String, required: true}
// });

// module.exports = mongoose.model("Product", productSchema);


const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    enum: ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Biography', 'History', 'Self-Help', 'Other'],
    default: 'Other'
  },
  stock: {
    type: Number,
    default: 10,
    min: 0
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);
