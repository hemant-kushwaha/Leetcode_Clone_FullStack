const {
  getLanguageById,
  submitBatch,
  submitToken
} = require('../utils/problem');

const Problem = require('../models/Problem.model');

const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution
  } = req.body;

  try {
    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);

      //Batch Submission Creation
      const submissions = visibleTestCases.map((testCase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testCase.input,
        expected_output: testCase.output
      }));

      const submitResult = await submitBatch(submissions);
      if (!submitResult) {
        return res.status(500).json({ error: 'Batch submission failed' });
      }

      const resultToken = submitResult.map((v) => v.token); //[t1,t2,t3]
      console.log(resultToken.join(','));

      const testResult = await submitToken(resultToken);
      if (!testResult) {
        return res.status(500).json({
          error: 'No result from Judge0'
        });
      }
      console.log(testResult);

      for (const test of testResult) {
        if (test.status_id !== 3) {
          return res.status(400).send('Error Occured From Judge0 API');
        }
      }
    }

    // Now Saving Problem To DB
    const createdProblem = await Problem.create({
      ...req.body,
      problemCreator: req.user._id
    });

    res
      .status(201)
      .json({ success: true, message: 'Problem Created SuccessFully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const updateProblem = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution
  } = req.body;

  try {
    if (!id) {
      return res.send(400).send('Missing ID');
    }

    const DSAProblem = await Problem.findById(id);
    if (!DSAProblem) {
      return res.send(404).send('ID is not present In Server');
    }

    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);

      //Batch Submission Creation
      const submissions = visibleTestCases.map((testCase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testCase.input,
        expected_output: testCase.output
      }));

      const submitResult = await submitBatch(submissions);
      if (!submitResult) {
        return res.status(500).json({ error: 'Batch submission failed' });
      }

      const resultToken = submitResult.map((v) => v.token); //[t1,t2,t3]
      console.log(resultToken.join(','));

      const testResult = await submitToken(resultToken);
      if (!testResult) {
        return res.status(500).json({
          error: 'No result from Judge0'
        });
      }

      for (const test of testResult) {
        if (test.status_id !== 3) {
          return res.status(400).send('Error Occured From Judge0 API');
        }
      }
    }

    // Now Updating Problem To DB
    await Problem.findByIdAndUpdate(
      id,
      { ...req.body },
      { runValidators: true, new: true }
    );

    res
      .status(200)
      .json({ success: true, message: 'Problem Updated SuccessFully' });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.send(400).send('Missing ID');
    }

    const DSAProblem = await Problem.findById(id);
    if (!DSAProblem) {
      return res.send(404).send('ID is not present In Server');
    }

    const deletedProblem = await Problem.findByIdAndDelete(id);
    if (!deletedProblem) {
      return res.send(404).send('Problem is Missing');
    }

    res
      .status(200)
      .json({ success: true, message: 'Problem Deleted SuccessFully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.send(400).send('Missing ID');
    }

    const DSAProblem = await Problem.findById(id).select(
      '-hiddenTestCases -problemCreator -referenceSolution -createdAt -updatedAt -__v'
    );
    if (!DSAProblem) {
      return res.send(404).send('Problem is Missing');
    }

    res.status(200).json(DSAProblem);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllProblem = async (req, res) => {
  try {
    const ALLDSAProblem = await Problem.find({}).select(
      '_id title difficulty tags'
    );
    if (ALLDSAProblem.length == 0) {
      return res.send(404).send('Unable to fetch problem');
    }

    res.status(200).json(ALLDSAProblem);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblem
  // getAllSolvedProblemByUser
};
