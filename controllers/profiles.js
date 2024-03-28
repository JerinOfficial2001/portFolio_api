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
        const userData = await PortFolio_Auth.findById(DATA.userID);
        if (uploadRes) {
          DATA.image = {
            url: uploadRes.secure_url,
            public_id: uploadRes.public_id,
          };
          DATA.gender = userData.gender;
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
  const { name, role, qualification, about, image, from, userID } = req.body;
  try {
    const profile = await PortFolio_Profile.findById(req.params.id);
    const imgID = profile.image.public_id;

    if (req.file) {
      if (imgID) {
        await cloudinary.uploader.destroy(imgID);
      }
      const newImg = await cloudinary.uploader.upload(
        req.file.path,
        {
          upload_preset: "Portfolio_profile",
        },
        (err, imgResult) => {
          if (err) {
            return res.send({ status: "error", message: err });
          } else {
            return imgResult;
          }
        }
      );
      const userData = await PortFolio_Auth.findById(userID);
      if (newImg) {
        const NewObj = {
          name,
          role,
          qualification,
          about,
          image,
          from,
          userID,
        };
        NewObj.image = { public_id: newImg.public_id, url: newImg.secure_url };
        NewObj.gender = userData.gender;
        await PortFolio_Profile.findByIdAndUpdate(req.params.id, NewObj, {
          new: true,
        });
        res.send({ status: "ok", message: "Profile Updated successfully" });
      } else {
        res.send({ status: "error", message: "Something went wrong" });
      }
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
