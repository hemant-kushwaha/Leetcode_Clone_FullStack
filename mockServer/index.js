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

    setTimeout(() => {
      try {
        const { stdin, expected_output } = submission;

        // simple logic (for add problem)
        const [a, b] = stdin.split(" ").map(Number);
        const output = String(a + b);

        submission.stdout = output;

        if (output === expected_output) {
          submission.status_id = 3;
          submission.status = { description: "Accepted" };
        } else {
          submission.status_id = 4;
          submission.status = { description: "Wrong Answer" };
        }
      } catch (err) {
        submission.status_id = 13;
        submission.status = { description: "Internal Error" };
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
