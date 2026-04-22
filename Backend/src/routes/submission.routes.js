const express = require('express');
const submissionRouter = express.Router();

const auth = require('../middlewares/auth.middleware');
const authorizeRole = require('../middlewares/authorizeRole.middleware');
const { submitCode, runCode } = require('../controllers/submission.controller');

submissionRouter.use(auth);

// Shared Access
submissionRouter.post('/run/:id', runCode);
submissionRouter.post('/submit/:id', submitCode);

module.exports = submissionRouter;
