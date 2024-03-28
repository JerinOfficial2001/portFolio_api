const express = require("express");
const {
  addCredentials,
  getCredentials,
  updateCredentials,
  deleteCredentials,
} = require("../controllers/credentials");

const router = express.Router();
const multer = require("multer");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/credentials");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });
router.post("/add", upload.single("image"), addCredentials);
router.get("/get/:id", getCredentials);
router.put("/update/:id", upload.single("image"), updateCredentials);
router.delete("/remove/:id", deleteCredentials);

module.exports = router;
