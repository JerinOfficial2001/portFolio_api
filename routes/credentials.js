const express = require("express");
const {
  addCredentials,
  getCredentials,
  updateCredentials,
  deleteCredentials,
} = require("../controllers/credentials");

const router = express.Router();
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Portfolio_profile",
  },
});

const upload = multer({ storage: storage });
router.post("/add", upload.single("image"), addCredentials);
router.get("/get/:id", getCredentials);
router.put("/update/:id", upload.single("image"), updateCredentials);
router.delete("/remove/:id", deleteCredentials);

module.exports = router;
