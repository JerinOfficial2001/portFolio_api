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
exports.updateWebsite = async (req, res) => {
  const singleImage = req.files["image"][0];
  const multiImages = req.files["images"];
  const { title, endpoint, link, userID, isVisible, credentials } = req.body;
  try {
    if (title && endpoint && link && userID) {
      const Project = await PortFolio_Projects.findById(req.params.id);
      if (Project) {
        if (singleImage) {
          if (Project.image) {
            const imgID = Project.image.public_id;
            const { result } = await cloudinary.uploader.destroy(imgID);
            if (result != "ok") {
              return res
                .status(200)
                .json({ status: "error", message: "Image deletion failed" });
            }
          }

          const updatedData = {
            isVisible: isVisible || true,
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
            endpoint: endpoint ? JSON.parse(endpoint) : [],
            link,
            userID,
            credentials: req.body.credentials
              ? JSON.parse(req.body.credentials)
              : null,
          };
          const result = await PortFolio_Projects.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
          );
          if (result) {
            res.status(200).json({
              status: "ok",
              message: "Project Updated Successfully",
            });
          } else {
            return res
              .status(200)
              .json({ status: "error", message: "Something went wrong" });
          }
        } else {
          const updatedData = {
            isVisible: isVisible || true,
            image: Project.image,
            title,
            endpoint: endpoint ? JSON.parse(endpoint) : [],
            link,
            userID,
            credentials: req.body.credentials
              ? JSON.parse(req.body.credentials)
              : null,
          };
          const result = await PortFolio_Projects.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
          );
          if (result) {
            res.status(200).json({
              status: "ok",
              message: "Project Updated Successfully",
            });
          } else {
            return res
              .status(200)
              .json({ status: "error", message: "Something went wrong" });
          }
        }
      } else {
        res.status(404).json({ status: "error", message: "Project Not Found" });
      }
    } else {
      res.status(400).json({
        status: "error",
        message: "All fields are mandatory and at least one file is required",
      });
    }
  } catch (error) {
    next(error);
  }
};
exports.updateApplication = async (req, res) => {
  const { title, userID, isVisible, tools, description, category } = req.body;
  try {
    const singleImage = req.files["image"] ? req.files["image"][0] : null;
    const multiImages = req.files["images"];
    if (description && title && userID && category && tools.length !== 0) {
      const DATA = {
        isVisible: isVisible || true,
        title,
        userID,
        tools: req.body.tools ? JSON.parse(req.body.tools) : [],
        description,
        category,
        apk_id: req.body.apk_id,
      };
      const project = await PortFolio_Projects.findById(req.params.id);
      const deletedIds = req.body.deletedIds
        ? JSON.parse(req.body.deletedIds)
        : [];
      if (project) {
        if (singleImage) {
          if (project.image && project.image.public_id) {
            const { result } = await cloudinary.uploader.destroy(
              project.image.public_id
            );
            if (result != "ok") {
              return res
                .status(200)
                .json({ status: "error", message: "Image deletion failed" });
            }
          }
          DATA.image = {
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
        } else {
          DATA.image = project.image;
        }
        if (deletedIds.length > 0) {
          deletedIds.map(async (elem) => {
            const { result } = await cloudinary.uploader.destroy(elem);
            if (result != "ok") {
              return res
                .status(200)
                .json({ status: "error", message: "Image deletion failed" });
            }
          });
        }
        if (multiImages) {
          if (project.images.length !== 0) {
            DATA.images = project.images.concat(
              multiImages.map((elem) => ({
                url: elem.path,
                public_id: elem.path
                  .split("/")
                  .slice(-2)
                  .join("/")
                  .replace(/\.\w+$/, ""),
                mimetype: elem.mimetype,
                originalname: elem.originalname,
                size: elem.size,
              }))
            );
          } else {
            if (!project.images) {
              project.images = [];
            }
            if (!DATA.images) {
              DATA.images = [];
            }
            multiImages.map((elem) => {
              DATA.images.push({
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
        } else {
          DATA.images = project.images;
        }
        const result = await PortFolio_Projects.findByIdAndUpdate(
          req.params.id,
          DATA
        );
        if (result) {
          res.status(200).json({
            status: "ok",
            message: "Project Updated Successfully",
          });
        } else {
          res
            .status(200)
            .json({ status: "error", message: "Something went wrong" });
        }
      } else {
        res.status(200).json({ status: "error", message: "Project not found" });
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
