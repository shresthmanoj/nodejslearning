const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const taskRouter = require("./routes/task");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/task", taskRouter);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", () => {
  console.log("Connection error");
});
db.once("open", () => {
  console.log("Connected");
});

app.get("/", (req, res) => {
  res.send("Hello Manz");
});

const PORT = process.env.PORT || 3501;
app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
