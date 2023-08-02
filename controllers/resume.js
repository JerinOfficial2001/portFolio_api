const { Resume } = require("../models/Resume");
const cloudinary = require("../utils/cloudinary");

exports.addResume = async (req, res) => {
  const { image } = req.body;
  try {
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "images",
      });
      if (uploadRes) {
        const newVal = new Resume({
          image: uploadRes,
        });
        const result = await newVal.save();
        res.status(200).json({ status: "added", data: result });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
exports.getResume = async (req, res) => {
  try {
    const result = await Resume.find({});
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};
exports.updateResume = async (req, res) => {
  const { image } = req.body;
  try {
    const resume = await Resume.findById(req.params.id);
    const imgID = resume.image.public_id;
    if (imgID) {
      await cloudinary.uploader.destroy(imgID);
    }
    const newImg = await cloudinary.uploader.upload(image, {
      upload_preset: "images",
    });
    resume.image = {
      public_id: newImg.public_id,
      url: newImg.secure_url,
    };
    await Resume.findByIdAndUpdate(req.params.id, resume, { new: true });
    res.send({ status: "updated", data: req.body });
  } catch (error) {
    console.log(error);
  }
};
