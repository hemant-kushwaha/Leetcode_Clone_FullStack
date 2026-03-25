require("dotenv").config();
const app = require("./app");
const initConnections = require("./loaders/index");
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await initConnections();
    app.listen(PORT, () => {
      console.log(`Server is running at PORT:${PORT}`);
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

startServer();
