const { getLanguageById, submitBatch } = require('../utils/problem');

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
      const submissions = visibleTestCases.map((input, output) => ({
        source_id: completeCode,
        language_id: languageId,
        stdin: input,
        expected_output: output
      }));

      const submitResult = await submitBatch(submissions);
    }
  } catch (error) {}
};
