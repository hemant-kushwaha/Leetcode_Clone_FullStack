const Problem = require('../models/Problem.model');
const Submission = require('../models/Submission.model');
const {
  getLanguageById,
  submitBatch,
  submitToken
} = require('../utils/problem');

const submitCode = async (req, res) => {
  try {
    const userId = req.user._id;
    const problemId = req.params.id;

    const { language, code } = req.body;

    if (!userId || !code || !problemId || !language) {
      return res.status(400).send('Some field is Missing');
    }

    //Fetch problem from DB to get Hidden testcases
    const problem = await Problem.findById(problemId);

    const submitttedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: 'pending',
      testCasesTotal: problem.hiddenTestCases.length
    });

    //Judge0
    const languageId = getLanguageById(language);
    const submissions = problem.hiddenTestCases.map((testCase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testCase.input,
      expected_output: testCase.output
    }));

    const submitResult = await submitBatch(submissions);

    const resultToken = submitResult.map((v) => v.token); //[t1,t2,t3]

    const testResult = await submitToken(resultToken);

    // Update Submitted Result
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = 'accepted';
    let errorMessage = null;

    for (const test of testResult) {
      if (test.status_id === 3) {
        testCasesPassed++;
        runtime += parseFloat(test.time);
        memory = Math.max(memory, test.memory);
      } else {
        if (test.status_id === 12) {
          status = 'error';
          errorMessage = test.stderr;
        }
      }
    }

    //Submit result to DB in Submission
    submitttedResult.status = status;
    submitttedResult.testCasesPassed = testCasesPassed;
    submitttedResult.errorMessage = errorMessage;
    submitttedResult.runtime = runtime;
    submitttedResult.memory = memory;

    await submitttedResult.save();

    //Adding Problem to problemSolved field of Problem model i.e problemId
    if (!req.user.problemSolved.includes(problemId)) {
      req.user.problemSolved.push(problemId);
      await req.user.save();
    }
    res.status(201).send(submitttedResult);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = submitCode;
