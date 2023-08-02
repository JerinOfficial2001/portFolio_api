const express = require("express");
const {
  addProject,
  getProjects,
  removeProject,
} = require("../controllers/projects");
const router = express.Router();

router.post("/add", addProject);
router.get("/get", getProjects);
router.delete("/:id", removeProject);

module.exports = router;
