const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

/**
 * In-memory DB (just like queue + storage)
 */
const submissionsDB = new Map();

/**
 * Simulate async execution (queue + processing)
 */
const processSubmission = (token) => {
  setTimeout(() => {
    const submission = submissionsDB.get(token);
    if (!submission) return;

    // Step 1 → Processing
    submission.status_id = 2;
    submission.status = { description: "Processing" };

    const startTime = Date.now();

    setTimeout(() => {
      try {
        const { stdin, expected_output } = submission;

        const values = stdin.split(" ").map(Number);

        // check if any value is NaN
        if (values.some((v) => isNaN(v))) {
          throw new Error("Invalid input");
        }

        submission.stdout = expected_output;

        // simulate execution metrics
        submission.time = ((Date.now() - startTime) / 1000).toFixed(3); // seconds
        submission.memory = Math.floor(Math.random() * 1000) + 500; // fake KB usage
        submission.stderr = null;

        submission.status_id = 3;
        submission.status = { description: "Accepted" };
      } catch (err) {
        submission.status_id = 13;
        submission.status = { description: "Internal Error" };

        // error case
        submission.stderr = err.message;
        submission.time = "0.000";
        submission.memory = 0;
      }
    }, 1500); // execution delay
  }, 1000); // queue delay
};

/**
 * POST /submissions/batch
 * Returns tokens
 */
app.post("/submissions/batch", (req, res) => {
  const { submissions } = req.body;

  if (!submissions || !Array.isArray(submissions)) {
    return res.status(400).json({ error: "Invalid submissions array" });
  }

  const tokens = submissions.map((sub) => {
    const token = uuidv4();

    submissionsDB.set(token, {
      token,
      ...sub,
      status_id: 1,
      status: { description: "In Queue" },
      stdout: null,
      stderr: null,
      time: null,
      memory: null,
    });

    processSubmission(token);

    return { token };
  });

  res.json(tokens);
});

/**
 * GET /submissions/batch
 * Returns results
 */
app.get("/submissions/batch", (req, res) => {
  const { tokens } = req.query;

  if (!tokens) {
    return res.status(400).json({ error: "Tokens required" });
  }

  const tokenList = tokens.split(",");

  const results = tokenList.map((token) => {
    return (
      submissionsDB.get(token) || {
        token,
        status_id: 13,
        status: { description: "Internal Error" },
      }
    );
  });

  res.json({ submissions: results });
});

/**
 * Start server
 */
app.listen(2358, () => {
  console.log("Mock Judge0 running at http://localhost:2358");
});

/*
| ID | Meaning        |
| -- | -------------- |
| 1  | In Queue       |
| 2  | Processing     |
| 3  | Accepted       |
| 4  | Wrong Answer   |
| 13 | Internal Error |
*/
