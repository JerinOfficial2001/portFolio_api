const { PortFolio_Credential } = require("../models/credentials");
const cloudinary = require("../utils/cloudinary");

exports.addCredentials = async (req, res, next) => {
  const { userID, education, skills, link } = req.body;
  const DATA = req.body;

  try {
    if (userID && education && link.length !== 0 && skills.length !== 0) {
      const user = await PortFolio_Credential.findOne({ userID });

      if (req.file && !user) {
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
              return result;
            }
          }
        );
        if (uploadRes) {
          const newVal = new PortFolio_Credential({
            image: {
              url: uploadRes.secure_url,
              public_id: uploadRes.public_id,
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
    const imgID = Credentials.image.public_id;

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

      if (newImg) {
        const NewObj = {
          image: {
            url: newImg.secure_url,
            public_id: newImg.public_id,
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
        res.send({ status: "error", message: "Something went wrong" });
      }
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
