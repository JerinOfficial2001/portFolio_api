const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());
const dotenv = require("dotenv");
const projects = require("./routes/projects");
dotenv.config();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("SERVER STARTED");
});
const MONGO = process.env.MONGODB;

mongoose.connect(MONGO).then(() => console.log("DB CONNECTED"));

app.use("/portfolio/projects", projects);
