const express = require('express');

const problemRouter = express.Router();
const auth = require('../middlewares/auth.middleware');
const authorizeRole = require('../middlewares/authorizeRole.middleware');
const createProblem = require('../controllers/problem.controller');

//middleware
problemRouter.use(auth);

//Admin Only
problemRouter.post('/', authorizeRole('admin'), createProblem);
// problemRouter.patch('/:id', authorizeRole('admin'), updateProblem);
// problemRouter.delete('/:id', authorizeRole('admin'), deleteProblem);

// //Shared Access
// problemRouter.get('/', getAllProblem);
// problemRouter.get('/:id', getProblemById);
// problemRouter.get('/solved',getAllSolvedProblemByUser);

module.exports = problemRouter;
