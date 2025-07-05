const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("The sever is running at port", port);
});
