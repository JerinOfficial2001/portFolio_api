const mongoose = require("mongoose");
const portFolioAuthSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: Object },
  password: { type: String, required: true },
  role: { type: String, required: true },
  gender: String,
  project_categories: [
    {
      type: mongoose.Types.ObjectId,
      ref: "PortFolio_ProjectCategories",
    },
  ],
});
const PortFolio_Auth = mongoose.model("PortFolio_Auth", portFolioAuthSchema);
exports.PortFolio_Auth = PortFolio_Auth;
