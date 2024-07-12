const { PortFolio_Projects } = require("../models/Projects/projects");
const cloudinary = require("../utils/cloudinary");

exports.addWebsite = async (req, res) => {
  const singleImage = req.files["image"][0];
  const multiImages = req.files["images"];
  const { title, endpoint, link, userID, isVisible, category } = req.body;
  try {
    if (link && title && userID && endpoint.length !== 0) {
      const Project = await PortFolio_Projects.findOne({ link });
      if (Project) {
        return res
          .status(200)
          .json({ status: "error", message: "Project Already Exists" });
      }
      if (singleImage) {
        const DATA = {
          isVisible: isVisible ? isVisible : true,
          image: {
            url: singleImage.path,
            public_id: singleImage.path
              .split("/")
              .slice(-2)
              .join("/")
              .replace(/\.\w+$/, ""),
            mimetype: singleImage.mimetype,
            originalname: singleImage.originalname,
            size: singleImage.size,
          },
          title,
          endpoint: req.body.endpoint ? JSON.parse(req.body.endpoint) : [],
          link,
          userID,
          credentials: req.body.credentials
            ? JSON.parse(req.body.credentials)
            : null,
          category,
        };
        const newVal = new PortFolio_Projects(DATA);
        const result = await newVal.save();

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
exports.addApplication = async (req, res) => {
  const { title, userID, isVisible, tools, description, category } = req.body;
  try {
    const singleImage = req.files["image"][0];
    const multiImages = req.files["images"];
    if (description && title && userID && category && tools.length !== 0) {
      const DATA = {
        isVisible: isVisible ? isVisible : true,
        title,
        userID,
        tools: req.body.tools ? JSON.parse(req.body.tools) : [],
        description,
        category,
      };
      const newVal = new PortFolio_Projects(DATA);
      if (singleImage) {
        newVal.image = {
          url: singleImage.path,
          public_id: singleImage.path
            .split("/")
            .slice(-2)
            .join("/")
            .replace(/\.\w+$/, ""),
          mimetype: singleImage.mimetype,
          originalname: singleImage.originalname,
          size: singleImage.size,
        };
      }
      if (multiImages) {
        multiImages.map((elem) => {
          newVal.images.push({
            url: elem.path,
            public_id: elem.path
              .split("/")
              .slice(-2)
              .join("/")
              .replace(/\.\w+$/, ""),
            mimetype: elem.mimetype,
            originalname: elem.originalname,
            size: elem.size,
          });
        });
      }
      const result = await newVal.save();
      if (result) {
        res.status(200).json({
          status: "ok",
          message: "Project Added Successfully",
        });
      } else {
        res
          .status(200)
          .json({ status: "error", message: "Something went wrong" });
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
