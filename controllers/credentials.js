const { PortFolio_Credential } = require("../models/credentials");
const cloudinary = require("../utils/cloudinary");

exports.addCredentials = async (req, res, next) => {
  const { userID, education, skills, link } = req.body;
  const DATA = req.body;

  try {
    if (userID && education && link.length !== 0 && skills.length !== 0) {
      const user = await PortFolio_Credential.findOne({ userID });

      if (req.file && !user) {
        const newVal = new PortFolio_Credential({
          image: {
            url: req.file.path,
            public_id: req.file.path
              .split("/")
              .slice(-2)
              .join("/")
              .replace(/\.\w+$/, ""),
            mimetype: req.file.mimetype,
            originalname: req.file.originalname,
            size: req.file.size,
          },
          education: JSON.parse(req.body.education),
          skills: JSON.parse(req.body.skills),
          link: JSON.parse(req.body.link),
          userID: req.body.userID,
        });
        const result = await newVal.save();
        if (result) {
          res.status(200).json({
            status: "ok",
            message: "Credential Added Successfully",
          });
        } else {
          res.status(200).json({
            status: "error",
            message: "Something went wrong",
          });
        }
      } else if (!user) {
        const result = await PortFolio_Credential.create(req.body);
        if (result) {
          res.status(200).json({ status: "ok", data: result });
        } else {
          res.status(200).json({ status: "error", message: "No Data Found" });
        }
      } else {
        res.status(200).json({
          status: "error",
          message: "Credentials already available",
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
exports.updateCredentials = async (req, res, next) => {
  const { userID, education, skills, link } = req.body;
  try {
    const Credentials = await PortFolio_Credential.findById(req.params.id);
    const imgID =
      Credentials.image && Credentials.image != null
        ? Credentials.image.public_id
        : false;
    if (req.body.isDeleteImage) {
      if (imgID) {
        await cloudinary.uploader.destroy(imgID);
        Credentials.image = null;
      }
    }
    if (req.file) {
      if (imgID) {
        await cloudinary.uploader.destroy(imgID);
      }
      const NewObj = {
        image: {
          url: req.file.path,
          public_id: req.file.path
            .split("/")
            .slice(-2)
            .join("/")
            .replace(/\.\w+$/, ""),
          mimetype: req.file.mimetype,
          originalname: req.file.originalname,
          size: req.file.size,
        },
        education: JSON.parse(req.body.education),
        skills: JSON.parse(req.body.skills),
        link: JSON.parse(req.body.link),
        userID: req.body.userID,
      };

      await PortFolio_Credential.findByIdAndUpdate(req.params.id, NewObj, {
        new: true,
      });
      res.send({ status: "ok", message: "Credentials Updated successfully" });
    } else {
      const NewObj = {
        image: Credentials.image,
        education: JSON.parse(req.body.education),
        skills: JSON.parse(req.body.skills),
        link: JSON.parse(req.body.link),
        userID: req.body.userID,
      };

      await PortFolio_Credential.findByIdAndUpdate(req.params.id, NewObj, {
        new: true,
      });
      res.send({ status: "ok", message: "Credentials Updated successfully" });
    }
  } catch (error) {
    next(error);
  }
};
exports.deleteCredentials = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
exports.getCredentials = async (req, res, next) => {
  try {
    const result = await PortFolio_Credential.findOne({
      userID: req.params.id,
    });
    if (result) {
      res.status(200).json({ status: "ok", data: result });
    } else {
      res.status(200).json({ status: "error", message: "No data found" });
    }
  } catch (error) {
    console.log(error);
  }
};
