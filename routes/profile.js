const express = require("express");
const {
  addProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  GetAllProfile,
} = require("../controllers/profiles");

const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Portfolio_profile",
  },
});

const upload = multer({ storage: storage });
router.post("/add", upload.single("image"), addProfile);
router.get("/get/:id", getProfile);
router.get("/get", GetAllProfile);
router.put("/update/:id", upload.single("image"), updateProfile);
router.delete("/remove/:id", deleteProfile);

module.exports = router;
