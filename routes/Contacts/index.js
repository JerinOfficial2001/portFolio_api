const express = require("express");
const {
  addContact,
  getContact,
  updateContact,
  deleteContact,
} = require("../../controllers/Contacts");

const router = express.Router();

router.post("/add", addContact);
router.get("/get/:id", getContact);
router.put("/update/:id", updateContact);
router.delete("/remove/:id", deleteContact);

module.exports = router;
