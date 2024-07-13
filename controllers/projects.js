const { PortFolio_Projects } = require("../models/Projects/projects");
const {
  addWebsite,
  addApplication,
  updateWebsite,
  updateApplication,
} = require("../services/projects");
const cloudinary = require("../utils/cloudinary");
const BASE_URL = process.env.BASE_URL;
exports.addProject = async (req, res) => {
  const { category } = req.body;
  try {
    if (category == "Website") {
      addWebsite(req, res);
    } else if (category == "Application") {
      console.log("application");
      addApplication(req, res);
    }
  } catch (error) {
    console.log(error);
  }
};
exports.getProjects = async (req, res) => {
  try {
    const result = await PortFolio_Projects.find({
      userID: req.params.id,
      category: req.query.category,
    });
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
    // const data = {
    //   userID: result.userID,
    //   isVisible: result.isVisible,
    //   link: result.link,
    //   endpoint: result.endpoint,
    //   title: result.title,
    //   _id: result._id,
    //   image: result.image?.map((elem) => `${BASE_URL}/${elem}`),
    // };
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
  const { category } = req.body;
  try {
    if (category == "Website") {
      updateWebsite(req, res);
    } else if (category == "Application") {
      updateApplication(req, res);
    }
  } catch (error) {
    console.log(error);
  }
};
exports.updateVisiblity = async (req, res, next) => {
  try {
    // Handle case where no files are uploaded
    const Project = await PortFolio_Projects.findById(req.params.id);
    if (Project) {
      const updatedData = {
        isVisible: req.body.isVisible,
        image: Project.image,
        title: Project.title,
        endpoint: Project.endpoint,
        link: Project.link,
        userID: Project.userID,
        credentials: Project.credentials,
      };
      const result = await PortFolio_Projects.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true }
      );

      res.status(200).json({
        status: "ok",
        message: req.body.isVisible
          ? "Project visible to everyone"
          : "Project added to draft",
      });
    } else {
      res.status(404).json({ status: "error", message: "Project Not Found" });
    }
  } catch (error) {
    next(error);
  }
};
