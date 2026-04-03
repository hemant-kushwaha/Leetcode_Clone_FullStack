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

module.exports = createProblem;
