const mongoose = require("mongoose");
const portFolio_CredentialSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  education: {
    degree: { type: Object, required: true },
    HSC: { type: Object, required: true },
    SSLC: { type: Object, required: true },
  },

  skills: { type: Array, required: true },
  link: [
    {
      url: { type: String, required: true },
      name: { type: String, required: true },
    },
  ],
});
const PortFolio_Credential = mongoose.model(
  "PortFolio_Credential",
  portFolio_CredentialSchema
);
exports.PortFolio_Credential = PortFolio_Credential;
