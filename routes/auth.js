const express = require("express");
const {
  login,
  register,
  userData,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserByID,
} = require("../controllers/auth");
const router = express.Router();
const multer = require("multer");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/auth");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });
router.post("/login", login);
router.post("/register", upload.single("image"), register);
router.get("/userData", userData);
router.get("/allUsers", getAllUsers);
router.get("/get/:id", getUserByID);
router.put("/update", upload.single("image"), updateUser);
router.delete("/remove", deleteUser);

module.exports = router;
