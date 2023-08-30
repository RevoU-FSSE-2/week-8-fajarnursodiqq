const express = require("express");
const bodyParser = require("body-parser");
const apiRouter = require("./routes/apiRoutes");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use("/", apiRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
