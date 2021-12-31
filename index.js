// express proxy server for golang cli application
const express = require("express");
const cors = require("cors");
const app = express();
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const port = process.env.PORT || 3000;

// Rate Limiting
const limiter = rateLimit({
  windowMs: 1440 * 60 * 1000, // 24 minutes
  max: 5, // limit each IP to 5 requests per windowMs
});

app.use(limiter);
app.set("trust proxy", 1); // trust first proxy
app.use(cors());
app.use("/api", require("./routes/aqi"));

app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
    success: true,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
