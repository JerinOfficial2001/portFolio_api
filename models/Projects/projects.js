const mongoose = require("mongoose");
const portFolio_ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: Object, required: true },
  category: { type: String, required: true },
  endpoint: { type: [Object] },
  link: { type: String },
  userID: { type: String, required: true },
  isVisible: Boolean,
  credentials: { type: Object },
  type: String,
  description: String,
  images: Array,
  tools: Array,
  apk_id: String,
});
const PortFolio_Projects = mongoose.model(
  "PortFolio_Projects",
  portFolio_ProjectSchema
);
exports.PortFolio_Projects = PortFolio_Projects;
