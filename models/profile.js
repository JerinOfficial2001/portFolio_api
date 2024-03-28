const mongoose = require("mongoose");
const portFolioProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  qualification: { type: String, required: true },
  about: { type: String, required: true },
  image: { type: Object, required: true },
  gender: { type: String },
  from: {
    type: String,
    required: true,
  },
  userID: { type: String, required: true },
});
const PortFolio_Profile = mongoose.model(
  "PortFolio_Profile",
  portFolioProfileSchema
);
exports.PortFolio_Profile = PortFolio_Profile;
