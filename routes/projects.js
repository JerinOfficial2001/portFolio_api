const express = require("express");
const {
  addProject,
  getProjects,
  removeProject,
  updateProject,
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

const upload = multer({ storage: fileStorageEngine });
router.post("/add", upload.single("image"), addProject);
router.get("/get/:id", getProjects);
router.delete("/remove/:id", removeProject);
router.put("/update/:id", upload.single("image"), updateProject);

module.exports = router;
