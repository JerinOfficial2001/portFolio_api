const SECRET_KEY = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const { PortFolio_Auth } = require("../models/auth");

exports.Authentication = async (req) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return false;
    }
    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await PortFolio_Auth.findById(decoded.userId);
    if (user) {
      if (user._id == req.query.userID) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};
