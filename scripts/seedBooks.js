const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Book = require("../models/Book");

dotenv.config();

const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 299,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300",
    description: "A classic American novel set in the Jazz Age",
    genre: "Fiction",
    stock: 15,
    rating: 4.2,
    reviews: 1250
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 349,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300",
    description: "A gripping tale of racial injustice and childhood innocence",
    genre: "Fiction",
    stock: 20,
    rating: 4.5,
    reviews: 2100
  },
  {
    title: "1984",
    author: "George Orwell",
    price: 279,
    image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300",
    description: "A dystopian social science fiction novel",
    genre: "Sci-Fi",
    stock: 12,
    rating: 4.4,
    reviews: 1800
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 329,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300",
    description: "A romantic novel of manners",
    genre: "Romance",
    stock: 18,
    rating: 4.3,
    reviews: 1650
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    price: 289,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    description: "A controversial novel about teenage rebellion",
    genre: "Fiction",
    stock: 10,
    rating: 3.9,
    reviews: 980
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    price: 449,
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300",
    description: "A brief history of humankind",
    genre: "Non-Fiction",
    stock: 25,
    rating: 4.6,
    reviews: 3200
  }
];

const seedBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    await Book.deleteMany({});
    console.log("Cleared existing books");

    await Book.insertMany(sampleBooks);
    console.log("Sample books added successfully");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding books:", error);
    process.exit(1);
  }
};

seedBooks();