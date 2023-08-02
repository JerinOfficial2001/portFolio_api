const { Projects } = require("../models/Projects");
const cloudinary = require("../utils/cloudinary");

exports.addProject = async (req, res) => {
  const { image, link, title } = req.body;
  try {
    const uploadRes = await cloudinary.uploader.upload(image, {
      upload_preset: "images",
    });
    // const uploadRes1 = await cloudinary.uploader.upload(image1, {
    //   upload_preset: "images",
    // });
    // const uploadRes2 = await cloudinary.uploader.upload(image2, {
    //   upload_preset: "images",
    // });

    const newProject = new Projects({
      // image2: uploadRes2,
      // image1: uploadRes1,
      image: uploadRes,
      link,
      title,
    });
    const result = await newProject.save();
    res.status(200).json({ status: "added", data: result });
  } catch (error) {
    console.log(error);
  }
};
exports.getProjects = async (req, res) => {
  try {
    const result = await Projects.find({});
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};
exports.removeProject = async (req, res) => {
  try {
    const projectImg = await Projects.findById(req.params.id);
    const imgID = projectImg.image.public_id;
    await cloudinary.uploader.destroy(imgID);

    // const imgID1 = projectImg.image1.public_id;
    // await cloudinary.uploader.destroy(imgID1);

    // const imgID2 = projectImg.image2.public_id;
    // await cloudinary.uploader.destroy(imgID2);

    await Projects.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: "deleted" });
  } catch (error) {
    console.log(error);
  }
};
