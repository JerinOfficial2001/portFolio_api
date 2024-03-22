const mongoose = require("mongoose");
const portFolio_resumeSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  pdf: { name: String, data: Object },
  isVisible: Boolean,
});
const PortFolio_Resume = mongoose.model(
  "PortFolio_Resume",
  portFolio_resumeSchema
);
exports.PortFolio_Resume = PortFolio_Resume;
