const mongoose = require("mongoose");

const url = process.env.DB_URL;

async function connectDB() {
  try {
    await mongoose.connect(url);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.log("DB Error:", error.message);
    process.exit(1);

  }
}

module.exports = connectDB;
