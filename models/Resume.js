const mongoose = require("mongoose");
const resumeSchema = new mongoose.Schema({
  //   title: { type: String, required: true },
  //   link: { type: String, required: true },
  image: { type: Object, required: true },
  // image1: { type: Object, required: true },
  // image2: { type: Object, required: true },
  // description: { type: String, required: true },
  // toolsUsed: { type: String, required: true },
});
const Resume = mongoose.model("Resume", resumeSchema);
exports.Resume = Resume;
