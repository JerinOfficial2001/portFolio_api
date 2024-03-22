const mongoose = require("mongoose");
const portFolioContactSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  mails: { type: Array, required: true },
  numbers: { type: Array, required: true },
  address: { type: Object, required: true },
});
const PortFolio_Contact = mongoose.model(
  "PortFolio_Contact",
  portFolioContactSchema
);
exports.PortFolio_Contact = PortFolio_Contact;
