const { PortFolio_Profile } = require("../models/profile");
const cloudinary = require("../utils/cloudinary");

exports.addProfile = async (req, res, next) => {
  const { name, role, qualification, about, userID } = req.body;
  try {
    const DATA = req.body;
    if (name && role && qualification && about && userID) {
      const Profile = await PortFolio_Profile.findOne({ userID });
      if (Profile) {
        return res
          .status(200)
          .json({ status: "error", message: "Profile Already Exists" });
      }
      if (req.file) {
        const uploadRes = await cloudinary.uploader.upload(
          req.file.path,
          {
            upload_preset: "Portfolio_profile",
          },
          (error, result) => {
            if (error) {
              return res.status(200).json({
                status: "error",
                message: "Image Should not exceed 70MB",
              });
            } else {
              console.log("Image uploaded to Cloudinary successfully:", result);
              // Here you can use the result variable which contains details about the uploaded image
            }
          }
        );
        if (uploadRes) {
          DATA.image = {
            url: uploadRes.secure_url,
            public_id: uploadRes.public_id,
          };
          const newVal = new PortFolio_Profile(DATA);
          const result = await newVal.save();
          res.status(200).json({
            status: "ok",
            message: "Profile Added Successfully",
          });
        }
      } else {
        res.status(200).json({
          status: "error",
          message: "Image file should not be empty",
        });
      }
    } else {
      res
        .status(200)
        .json({ status: "error", message: "All fields are Mandatory" });
    }
  } catch (error) {
    next(error);
  }
};
exports.getProfile = async (req, res, next) => {
  try {
    const userProfile = await PortFolio_Profile.findOne({
      userID: req.params.id,
    });
    if (userProfile) {
      res.status(200).json({ status: "ok", data: userProfile });
    } else {
      res.status(200).json({ status: "error", message: "No Data Found" });
    }
  } catch (error) {
    next(error);
  }
};
exports.updateProfile = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
exports.deleteProfile = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
