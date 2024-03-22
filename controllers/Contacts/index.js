const { PortFolio_Contact } = require("../../models/Contacts");

exports.addContact = async (req, res, next) => {
  const { userID, mails, numbers, address } = req.body;
  try {
    if (userID && mails.length !== 0 && numbers.length !== 0 && address) {
      const user = await PortFolio_Contact.findOne({ userID });
      if (!user) {
        const result = await PortFolio_Contact.create(req.body);
        if (result) {
          res.status(200).json({ status: "ok", data: result });
        } else {
          res.status(200).json({ status: "error", message: "No Data Found" });
        }
      } else {
        res.status(200).json({
          status: "error",
          message: "Contact Details already available",
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
exports.updateContact = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
exports.deleteContact = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
exports.getContact = async (req, res, next) => {
  try {
    const result = await PortFolio_Contact.find({ userID: req.params.id });
    if (result) {
      res.status(200).json({ status: "ok", data: result });
    } else {
      res.status(200).json({ status: "error", message: "No data found" });
    }
  } catch (error) {
    console.log(error);
  }
};
