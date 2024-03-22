const express = require("express");
const {
  addProfile,
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profiles");

const router = express.Router();
const multer = require("multer");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/profile");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });
router.post("/add", upload.single("image"), addProfile);
router.get("/get/:id", getProfile);
router.put("/update/:id", upload.single("image"), updateProfile);
router.delete("/remove/:id", deleteProfile);

module.exports = router;
