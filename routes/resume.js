const express = require("express");
const { addResume, getResume, updateResume } = require("../controllers/resume");
const router = express.Router();
const multer = require("multer");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/resume");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });
router.post("/add", upload.single("pdf"), addResume);
router.get("/get/:id", getResume);
router.put("/:id", upload.single("pdf"), updateResume);

module.exports = router;
