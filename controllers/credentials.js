const { PortFolio_Credential } = require("../models/credentials");

exports.addCredentials = async (req, res, next) => {
  const { userID, education, skills, link } = req.body;
  try {
    if (userID && education && link.length !== 0 && skills.length !== 0) {
      const user = await PortFolio_Credential.findOne({ userID });
      if (!user) {
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
  try {
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
    const result = await PortFolio_Credential.find({ userID: req.params.id });
    if (result) {
      res.status(200).json({ status: "ok", data: result });
    } else {
      res.status(200).json({ status: "error", message: "No data found" });
    }
  } catch (error) {
    console.log(error);
  }
};
