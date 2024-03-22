const express = require("express");
const {
  addCredentials,
  getCredentials,
  updateCredentials,
  deleteCredentials,
} = require("../controllers/credentials");

const router = express.Router();

router.post("/add", addCredentials);
router.get("/get/:id", getCredentials);
router.put("/update/:id", updateCredentials);
router.delete("/remove/:id", deleteCredentials);

module.exports = router;
