const express = require('express');

const problemRouter = express.Router();
const auth = require('../middlewares/auth.middleware');
const authorizeRole = require('../middlewares/authorizeRole.middleware');

//middleware
problemRouter.use(auth);

//Admin Only
problemRouter.post('/', createProblem);
problemRouter.patch('/:id', updateProblem);
problemRouter.delete('/:id', deleteProblem);

//Shared Access
problemRouter.get('/', authorizeRole('admin'), getAllProblem);
problemRouter.get('/:id', authorizeRole('admin'), getProblemById);
problemRouter.get('/solved', authorizeRole('admin'), getAllSolvedProblemByUser);

module.exports = problemRouter;
