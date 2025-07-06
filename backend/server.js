const express = require("express");
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");
const db_connection = require("./config/db");
const { default: helmet } = require("helmet");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Import routes

const port = process.env.PORT || 8000;
(async () => {
  try {
    await db_connection.authenticate();
    app.listen(port, () => {
      console.log("The sever is running at port", port);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
})();
