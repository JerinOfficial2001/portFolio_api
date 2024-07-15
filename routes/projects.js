const express = require("express");
const {
  addProject,
  getProjects,
  removeProject,
  updateProject,
  getProjectByID,
  updateVisiblity,
  uploadApk,
  getApk,
  downloadAPK,
  deleteAPK,
  getAPKbyName,
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
const apkStorage = multer.memoryStorage();
const uploadAPK = multer({ storage: apkStorage });
const upload = multer({ storage: storage });
router.post(
  "/add",
  upload.fields([{ name: "image", maxCount: 1 }, { name: "images" }]),
  addProject
);
router.get("/get/:id", getProjects);
router.get("/getByID/:id", getProjectByID);
router.delete("/remove/:id", removeProject);
router.put(
  "/update/:id",
  upload.fields([{ name: "image", maxCount: 1 }, { name: "images" }]),
  updateProject
);
router.put("/visibility/:id", updateVisiblity);
//*apk
router.post("/uploadapk", uploadAPK.single("file"), uploadApk);
router.get("/getapk", getApk);
router.get("/getapkbyname/:name", getAPKbyName);
router.get("/downloadapk/:id", downloadAPK);
router.delete("/deleteapk/:id", deleteAPK);
module.exports = router;
