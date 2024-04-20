const mongoose = require("mongoose");
const portFolio_ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  endpoint: { type: [Object], required: true },
  link: { type: String, required: true },
  image: { type: Object, required: true },
  userID: { type: String, required: true },
  isVisible: Boolean,
  credentials: { type: Object },
});
const PortFolio_Projects = mongoose.model(
  "PortFolio_Projects",
  portFolio_ProjectSchema
);
exports.PortFolio_Projects = PortFolio_Projects;
