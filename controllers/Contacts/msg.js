const { PortFolio_Contact_msg } = require("../../models/Contacts/msg");

exports.addMsg = async (req, res, next) => {
  const { userID, email, msg, senderID, name, subject } = req.body;
  try {
    if (userID && email && msg && senderID && name && subject) {
      const result = await PortFolio_Contact_msg.create(req.body);
      if (result) {
        res.status(200).json({ status: "ok", data: result });
      } else {
        res.status(200).json({ status: "error", message: "No Data Found" });
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
exports.updateMsg = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
exports.deleteMsg = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
exports.getMsg = async (req, res, next) => {
  try {
    const result = await PortFolio_Contact_msg.find({ userID: req.params.id });
    if (result) {
      res.status(200).json({ status: "ok", data: result });
    } else {
      res.status(200).json({ status: "error", message: "No data found" });
    }
  } catch (error) {
    console.log(error);
  }
};
