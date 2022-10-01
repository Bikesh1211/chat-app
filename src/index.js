const express = require("express");
const port = process.env.PORT || 3001;
const path = require("path");

const app = express();
const publicDirPath = path.join(__dirname, "../public");

app.use(express.static(publicDirPath));

app.get("/", (req, res) => {
  res.send("Hello Server ");
});

app.listen(port, () => {
  console.log("Server Is Running on " + port);
});
