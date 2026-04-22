const express = require('express');

const problemRouter = express.Router();
const auth = require('../middlewares/auth.middleware');
const authorizeRole = require('../middlewares/authorizeRole.middleware');
const {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblem,
  getAllSolvedProblemByUser
} = require('../controllers/problem.controller');

//middleware
problemRouter.use(auth);

//Admin Only
problemRouter.post('/', authorizeRole('admin'), createProblem);
problemRouter.put('/:id', authorizeRole('admin'), updateProblem);
problemRouter.delete('/:id', authorizeRole('admin'), deleteProblem);

// Shared Access
problemRouter.get('/', getAllProblem);
problemRouter.get('/solved', getAllSolvedProblemByUser);
problemRouter.get('/:id', getProblemById);

module.exports = problemRouter;
