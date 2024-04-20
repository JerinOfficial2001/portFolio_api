const express = require("express");
const {
  addProject,
  getProjects,
  removeProject,
  updateProject,
  getProjectByID,
} = require("../controllers/projects");
const router = express.Router();
const multer = require("multer");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/projects");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  // Check if the file is an array of objects (files)
  if (Array.isArray(req.files)) {
    cb(null, true); // Allow saving the files
  } else {
    // Reject the request if the file is an array of strings
    cb(new Error("Invalid file format. Expected an array of objects."));
  }
};
const upload = multer({ storage: fileStorageEngine });
router.post("/add", upload.single("image"), addProject);
router.get("/get/:id", getProjects);
router.get("/getByID/:id", getProjectByID);
router.delete("/remove/:id", removeProject);
router.put("/update/:id", upload.single("image"), updateProject);

module.exports = router;
