const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const {
  getAllFeedbacks,
  updateFeedback,
  deleteFeedback,
  AddFeedback,
} = require("../controllers/feedbacks");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Portfolio_feedback",
  },
});
const apkStorage = multer.memoryStorage();
const uploadAPK = multer({ storage: apkStorage });
const upload = multer({ storage: storage });
router.get("/getfeedbacks", getAllFeedbacks);
router.post("/add", upload.single("file"), AddFeedback);
router.put("/update/:id", upload.single("file"), updateFeedback);
router.delete("/delete/:id", upload.single("file"), deleteFeedback);
module.exports = router;
