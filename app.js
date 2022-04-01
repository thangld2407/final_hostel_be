require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

// CONSTANTS
const { connectToDB } = require("./database/dbConnect");
const router = require("./router");
const bodyParser = require("body-parser");

//express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// CORS
app.use(cors());

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.status(400).send("Api working");
});
app.use("/api", router);
app.use("*", (req, res) => {
  res.status(404).json({
    message: false,
    errors: [
      {
        msg: "Route not found",
      },
    ],
  });
});

// Collecting database , host
const PORT = process.env.PORT || 3000;

connectToDB().then((_) => {
  app.listen(PORT, (_) => {
    console.log(`Server started on port ${PORT}`);
  });
});
