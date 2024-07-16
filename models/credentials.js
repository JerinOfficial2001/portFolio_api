const mongoose = require("mongoose");
const portFolio_CredentialSchema = new mongoose.Schema({
  image: { type: Object },
  userID: { type: String, required: true },
  education: { type: Array, required: true },
  skills: { type: Array, required: true },
  link: { type: Object, required: true },
});
const PortFolio_Credential = mongoose.model(
  "PortFolio_Credential",
  portFolio_CredentialSchema
);
exports.PortFolio_Credential = PortFolio_Credential;
