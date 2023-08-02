const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  image: { type: Object, required: true },
  // image1: { type: Object, required: true },
  // image2: { type: Object, required: true },
  // description: { type: String, required: true },
  // toolsUsed: { type: String, required: true },
});
const Projects = mongoose.model("Projects", projectSchema);
exports.Projects = Projects;
