const express = require("express");
const {
  addProject,
  getProjects,
  removeProject,
  updateProject,
  getProjectByID,
  updateVisiblity,
} = require("../controllers/projects");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/projects");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Portfolio_project",
  },
});

const upload = multer({ storage: storage });
router.post(
  "/add",
  upload.fields([
    { name: "image", maxCount: 1 }, // For single image
    { name: "images" }, // For multiple images (up to 5)
  ]),
  addProject
);
router.get("/get/:id", getProjects);
router.get("/getByID/:id", getProjectByID);
router.delete("/remove/:id", removeProject);
router.put("/update/:id", upload.single("image"), updateProject);
router.put("/visibility/:id", updateVisiblity);

module.exports = router;
