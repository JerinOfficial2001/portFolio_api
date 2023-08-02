const express = require("express");
const { addResume, getResume, updateResume } = require("../controllers/resume");
const router = express.Router();

router.post("/add", addResume);
router.get("/get", getResume);
router.put("/:id", updateResume);

module.exports = router;
