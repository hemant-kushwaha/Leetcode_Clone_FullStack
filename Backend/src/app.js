const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.routes');
const adminRouter = require('./routes/admin.routes');
const problemRouter = require('./routes/problem.routes');

const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());

//routes
app.use('/api/auth', authRouter);
// app.use("/api/admin",adminRouter)
app.use('/api/problem', problemRouter);

module.exports = app;
