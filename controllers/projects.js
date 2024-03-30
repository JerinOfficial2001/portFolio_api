const { PortFolio_Projects } = require("../models/Projects");
const cloudinary = require("../utils/cloudinary");
const BASE_URL = process.env.BASE_URL;
exports.addProject = async (req, res) => {
  const { title, endpoint, link, userID, isVisible } = req.body;
  try {
    if (link && title && userID && endpoint.length !== 0) {
      const Project = await PortFolio_Projects.findOne({ link });
      if (Project) {
        return res
          .status(200)
          .json({ status: "error", message: "Project Already Exists" });
      }
      if (req.files) {
        // const uploadRes = await cloudinary.uploader.upload(
        //   req.file.path,
        //   {
        //     upload_preset: "Portfolio_project",
        //   },
        //   (error, result) => {
        //     if (error) {
        //       return res.status(200).json({
        //         status: "error",
        //         message: "Image Should not exceed 70MB",
        //       });
        //     } else {
        //       console.log("Image uploaded to Cloudinary successfully:", result);
        //       // Here you can use the result variable which contains details about the uploaded image
        //     }
        //   }
        // );

        const DATA = {
          isVisible: isVisible ? isVisible : true,
          image: req.files.map((elem) => `${BASE_URL}/${elem.path}`),
          title,
          endpoint: JSON.parse(req.body.endpoint),
          link,
          userID,
        };
        const newVal = new PortFolio_Projects(DATA);
        const result = await newVal.save();

        // res.status(200).json({
        //   status: "ok",
        //   message: newVal,
        // });
        res.status(200).json({
          status: "ok",
          message: "Project Added Successfully",
        });
      } else {
        res.status(200).json({
          status: "error",
          message: "Image file should not be empty",
        });
      }
    } else {
      res
        .status(200)
        .json({ status: "error", message: "All fields are Mandatory" });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.getProjects = async (req, res) => {
  try {
    const result = await PortFolio_Projects.find({ userID: req.params.id });
    if (result) {
      res.status(200).json({ status: "ok", data: result });
    } else {
      res.status(200).json({ status: "error", message: "No data found" });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.getProjectByID = async (req, res) => {
  try {
    const result = await PortFolio_Projects.findById(req.params.id);
    if (result) {
      res.status(200).json({ status: "ok", data: result });
    } else {
      res.status(200).json({ status: "error", message: "No data found" });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.removeProject = async (req, res) => {
  try {
    const projectImg = await Projects.findById(req.params.id);
    const imgID = projectImg.image.public_id;
    await cloudinary.uploader.destroy(imgID);
    await Projects.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: "ok", message: "Deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};
exports.updateProject = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
