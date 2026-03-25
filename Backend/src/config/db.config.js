const mongoose = require("mongoose");

const url = process.env.DB_URL;

async function connectDB() {
  try {
    await mongoose.connect(url);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection error:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
