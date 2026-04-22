const express = require('express');
const submissionRouter = express.Router();

const auth = require('../middlewares/auth.middleware');
const authorizeRole = require('../middlewares/authorizeRole.middleware');
const submitCode = require('../controllers/submission.controller');

submissionRouter.use(auth);

// Shared Access
// router.post("/run/:id", runCode);
submissionRouter.post('/submit/:id', submitCode);

module.exports = submissionRouter;
