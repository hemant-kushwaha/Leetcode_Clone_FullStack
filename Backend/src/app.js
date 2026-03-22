const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());

//routes

module.exports = app;
