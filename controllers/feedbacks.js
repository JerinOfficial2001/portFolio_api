const { PortFolio_Auth } = require("../models/auth");
const { Portfolio_FeedBackMsg } = require("../models/feedback");
const cloudinary = require("../utils/cloudinary");

const AddImage = (file) => {
  const image = {
    url: file.path,
    public_id: file.path
      .split("/")
      .slice(-2)
      .join("/")
      .replace(/\.\w+$/, ""),
    mimetype: file.mimetype,
    originalname: file.originalname,
    size: file.size,
  };
  return image;
};
exports.AddFeedback = async (req, res) => {
  const userData = await PortFolio_Auth.findById(req.body.user_id);
  const formData = {
    name: userData.name,
    image: userData.image,
    message: { text: req.body.message, image: null },
    user_id: req.body.user_id,
    gender: userData.gender,
  };
  try {
    if (req.file) {
      formData.message.image = AddImage(req.file);
      const result = await Portfolio_FeedBackMsg.create(formData);
      if (result) {
        res.status(200).json({ status: "ok", message: "Feedback sent" });
      } else {
        res
          .status(200)
          .json({ status: "error", message: "Posting feedback failed" });
      }
    } else {
      const result = await Portfolio_FeedBackMsg.create(formData);
      if (result) {
        res.status(200).json({ status: "ok", message: "Feedback sent" });
      } else {
        res
          .status(200)
          .json({ status: "error", message: "Posting feedback failed" });
      }
    }
  } catch (error) {
    throw error;
  }
};
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedBacks = await Portfolio_FeedBackMsg.find({});
    res.status(200).json({ status: "ok", data: feedBacks });
  } catch (error) {
    throw error;
  }
};
exports.updateFeedback = async (req, res) => {
  try {
    const feedBack = await Portfolio_FeedBackMsg.findById(req.params.id);
    if (feedBack) {
      feedBack.message.text = req.body.text;

      if (req.file) {
        if (feedBack.message.image && feedBack.message.image.public_id) {
          await cloudinary.uploader.destroy(feedBack.message.image.public_id);
          feedBack.message.image = null;
        }
        feedBack.message.image = AddImage(req.file);
      }
      const result = await Portfolio_FeedBackMsg.findByIdAndUpdate(
        req.params.id,
        feedBack
      );
      if (result) {
        res.status(200).json({ status: "ok", message: "Feedback updated" });
      } else {
        res
          .status(200)
          .json({ status: "error", message: "Feedback updation failed" });
      }
    } else {
      res
        .status(200)
        .json({ status: "error", message: "Required min 3 characters" });
    }
  } catch (error) {
    throw error;
  }
};
exports.deleteFeedback = async (req, res) => {
  try {
    const feedBack = await Portfolio_FeedBackMsg.findById(req.params.id);
    if (feedBack) {
      if (feedBack.message.image && feedBack.message.image.public_id) {
        await cloudinary.uploader.destroy(feedBack.message.image.public_id);
        feedBack.message.image = null;
      }
      const result = await Portfolio_FeedBackMsg.findByIdAndDelete(
        req.params.id
      );
      if (result) {
        res.status(200).json({ status: "ok", message: "Feedback Deleted" });
      } else {
        res
          .status(200)
          .json({ status: "error", message: "Feedback Deletion failed" });
      }
    } else {
      res.status(200).json({ status: "error", message: "Feedback not found" });
    }
  } catch (error) {
    throw error;
  }
};
