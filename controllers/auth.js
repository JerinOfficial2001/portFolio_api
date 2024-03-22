const jwt = require("jsonwebtoken");
const { PortFolio_Auth } = require("../models/auth");
const cloudinary = require("../utils/cloudinary");

const SECRET_KEY = process.env.JWT_SECRET;
exports.getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await PortFolio_Auth.find({});
    res.status(200).json({ status: "ok", data: allUsers });
  } catch (error) {
    next(error);
  }
};
exports.getUserByID = async (req, res, next) => {
  try {
    const user = await PortFolio_Auth.findOne(req.param.id);
    res.status(200).json({ status: "ok", data: user });
  } catch (error) {
    next(error);
  }
};
exports.register = async (req, res, next) => {
  const { name, password, email } = req.body;
  try {
    const DATA = req.body;
    if (email && name && password) {
      const user = await PortFolio_Auth.findOne({ email: DATA.email });
      if (user) {
        return res
          .status(200)
          .json({ status: "error", message: "User Already Exists" });
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
          const newVal = new PortFolio_Auth(DATA);
          const result = await newVal.save();
          res.status(200).json({
            status: "ok",
            data: "User Registerd Successfully",
          });
        }
      } else {
        const result = await PortFolio_Auth.create(DATA);
        if (result) {
          res
            .status(200)
            .json({ status: "ok", message: "User Registerd Successfully" });
        } else {
          res
            .status(200)
            .json({ status: "error", message: "Something went wrong" });
        }
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
exports.login = async (req, res, next) => {
  try {
    const user = await PortFolio_Auth.findOne({ email: req.body.email });
    if (!user) {
      res.status(200).json({ status: "error", message: "User not found" });
    } else if (user && user.password == req.body.password) {
      const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
        expiresIn: "24h",
      });

      res.status(200).json({ status: "ok", data: token });
    } else {
      res.status(401).json({ status: "error", message: "Invalid credentials" });
    }
  } catch (error) {
    next(error);
  }
};
exports.userData = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ status: "error", message: "Unauthorized - Missing Token" });
    }
    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await PortFolio_Auth.findById(decoded.userId);
    if (user) {
      res.status(200).json({ status: "ok", data: user });
    } else {
      res.status(404).json({ status: "error", message: "User not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(401)
      .json({ status: "error", message: "Unauthorized - Invalid Token" });
  }
};
exports.updateUser = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
exports.deleteUser = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
