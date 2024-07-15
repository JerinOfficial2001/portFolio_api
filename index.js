const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());
const dotenv = require("dotenv");
const projects = require("./routes/projects");
const profile = require("./routes/profile");
const resume = require("./routes/resume");
const auth = require("./routes/auth");
const contact = require("./routes/Contacts/index");
const contact_Msg = require("./routes/Contacts/msg");
const credentials = require("./routes/credentials");
dotenv.config();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`SERVER STARTED ${PORT}`);
});
const MONGO = process.env.MONGODB;

app.use("/portfolio/projects", projects);
app.use("/portfolio/resume", resume);
app.use("/portfolio/auth", auth);
app.use("/portfolio/profile", profile);
app.use("/portfolio/contact", contact);
app.use("/portfolio/contact/msg", contact_Msg);
app.use("/portfolio/credentials", credentials);
// app.use("/portfolio/Public", express.static(path.join(__dirname, "Public")));
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "PORTFOLIO Server Connected" });
});

mongoose
  .connect(MONGO)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
