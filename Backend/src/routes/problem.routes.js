const express = require('express');

const problemRouter = express.Router();

//Admin Only
problemRouter.post('/', createProblem);
problemRouter.patch('/:id', updateProblem);
problemRouter.delete('/:id', deleteProblem);

//Shared Access
problemRouter.get('/', getAllProblem);
problemRouter.get('/:id', getProblemById);
problemRouter.get('/solved', getAllSolvedProblemByUser);

module.exports = problemRouter;
