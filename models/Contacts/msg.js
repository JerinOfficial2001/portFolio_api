const mongoose = require("mongoose");
const portFolioContact_msgSchema = new mongoose.Schema({
  senderID: { type: String, required: true },
  email: { type: String, required: true },
  userID: { type: String, required: true },
  msg: { type: String, required: true },
  subject: { type: String, required: true },
  name: { type: String, required: true },
});
const PortFolio_Contact_msg = mongoose.model(
  "PortFolio_Contact_msg",
  portFolioContact_msgSchema
);
exports.PortFolio_Contact_msg = PortFolio_Contact_msg;
