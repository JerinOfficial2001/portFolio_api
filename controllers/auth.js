const jwt = require("jsonwebtoken");
const { PortFolio_Auth } = require("../models/auth");
const cloudinary = require("../utils/cloudinary");
const { Authentication } = require("../utils/Authentication");

const SECRET_KEY = process.env.JWT_SECRET;
exports.getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await PortFolio_Auth.find({});
    res.status(200).json({ status: "ok", data: allUsers });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
exports.getUserByID = async (req, res, next) => {
  try {
    const user = await PortFolio_Auth.findById(req.params.id);
    res.status(200).json({ status: "ok", data: user });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Internal server error" });
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
        const newVal = new PortFolio_Auth(DATA);
        const result = await newVal.save();
        res.status(200).json({
          status: "ok",
          data: "User Registerd Successfully",
        });
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
    res.status(500).json({ status: "error", message: "Internal server error" });
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
      res.status(200).json({ status: "error", message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
exports.userData = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(200)
        .json({ status: "error", message: "Unauthorized - Missing Token" });
    }
    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await PortFolio_Auth.findById(decoded.userId);
    if (user) {
      res.status(200).json({
        status: "ok",
        data: {
          accessToken: token,
          _id: user._id,
          name: user.name,
          email: user.email,
          gender: user.gender,
          role: user.role,
          password: user.password,
          image: user.image,
        },
      });
    } else {
      res.status(200).json({ status: "error", message: "User not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(401)
      .json({ status: "error", message: "Unauthorized - Invalid Token" });
  }
};
exports.updateUser = async (req, res, next) => {
  const { name, password, email } = req.body;

  try {
    if (Authentication(req)) {
      const DATA = req.body;
      const userData = await PortFolio_Auth.findById(req.query.userID);

      if (email && name && password) {
        if (req.file) {
          const imgID = userData.image.public_id;
          if (imgID) {
            await cloudinary.uploader.destroy(imgID);
          }
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
          const result = await PortFolio_Auth.findByIdAndUpdate(
            req.query.userID,
            DATA
          );
          const newRes = await PortFolio_Auth.findById(req.query.userID);

          res.status(200).json({
            status: "ok",
            message: "User Updated Successfully",
            data: newRes,
          });
        } else {
          const result = await PortFolio_Auth.findByIdAndUpdate(
            req.query.userID,
            DATA
          );
          if (result) {
            const newRes = await PortFolio_Auth.findById(req.query.userID);
            console.log(newRes);
            res.status(200).json({
              status: "ok",
              message: "User Updated Successfully",
              data: newRes,
            });
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
    } else {
      res.status(401).json({ status: "error", message: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
exports.deleteUser = async (req, res, next) => {
  try {
  } catch (error) {
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
