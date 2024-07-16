const { PortFolio_Auth } = require("../models/auth");
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
        const userData = await PortFolio_Auth.findById(DATA.userID);

        DATA.image = {
          url: req.file.path,
          public_id: req.file.path
            .split("/")
            .slice(-2)
            .join("/")
            .replace(/\.\w+$/, ""),
          mimetype: req.file.mimetype,
          originalname: req.file.originalname,
          size: req.file.size,
        };
        DATA.gender = userData.gender;
        const newVal = new PortFolio_Profile(DATA);
        const result = await newVal.save();
        res.status(200).json({
          status: "ok",
          message: "Profile Added Successfully",
        });
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
  const { name, role, qualification, about, image, from, userID } = req.body;
  try {
    const profile = await PortFolio_Profile.findById(req.params.id);
    const imgID = profile.image.public_id;

    if (req.file) {
      if (imgID) {
        await cloudinary.uploader.destroy(imgID);
      }

      const userData = await PortFolio_Auth.findById(userID);

      const NewObj = {
        name,
        role,
        qualification,
        about,
        image,
        from,
        userID,
      };
      NewObj.image = {
        url: req.file.path,
        public_id: req.file.path
          .split("/")
          .slice(-2)
          .join("/")
          .replace(/\.\w+$/, ""),
        mimetype: req.file.mimetype,
        originalname: req.file.originalname,
        size: req.file.size,
      };
      NewObj.gender = userData.gender;
      await PortFolio_Profile.findByIdAndUpdate(req.params.id, NewObj, {
        new: true,
      });
      res.send({ status: "ok", message: "Profile Updated successfully" });
    } else {
      const userData = await PortFolio_Auth.findById(userID);
      const NewObj = {
        image: profile.image,
        name,
        role,
        qualification,
        about,
        from,
        userID,
        gender: userData.gender,
      };

      await PortFolio_Profile.findByIdAndUpdate(req.params.id, NewObj, {
        new: true,
      });
      res.send({ status: "ok", message: "Profile Updated successfully" });
    }
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
exports.GetAllProfile = async (req, res, next) => {
  try {
    const userProfile = await PortFolio_Profile.find({});
    if (userProfile) {
      res.status(200).json({ status: "ok", data: userProfile });
    } else {
      res.status(200).json({ status: "error", message: "No Data Found" });
    }
  } catch (error) {
    next(error);
  }
};
