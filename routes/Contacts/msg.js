const express = require("express");
const {
  addMsg,
  getMsg,
  updateMsg,
  deleteMsg,
} = require("../../controllers/Contacts/msg");

const router = express.Router();

router.post("/add", addMsg);
router.get("/get/:id", getMsg);
router.put("/update/:id", updateMsg);
router.delete("/remove/:id", deleteMsg);

module.exports = router;
