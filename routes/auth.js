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

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Portfolio_profile",
  },
});

const upload = multer({ storage: storage });
router.post("/login", login);
router.post("/register", upload.single("image"), register);
router.get("/userData", userData);
router.get("/allUsers", getAllUsers);
router.get("/get/:id", getUserByID);
router.put("/update", upload.single("image"), updateUser);
router.delete("/remove", deleteUser);

module.exports = router;
