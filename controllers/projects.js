const { PortFolio_Projects } = require("../models/Projects/projects");
const { addWebsite, addApplication } = require("../services/projects");
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
// exports.updateProject = async (req, res, next) => {
//   const { title, endpoint, link, userID, isVisible } = req.body;
//   try {
//     if (title && endpoint && link && userID && req.files) {
//       const Project = await PortFolio_Projects.findById(req.params.id);
//       if (Project) {
//         const images = req.files.map((elem) => elem.path);
//         const updatedData = {
//           isVisible: isVisible || true,
//           image: Project.image.concat(images), // Concatenate new images with existing ones
//           title,
//           endpoint: JSON.parse(endpoint),
//           link,
//           userID,
//         };
//         const result = await PortFolio_Projects.findByIdAndUpdate(
//           req.params.id,
//           updatedData,
//           { new: true }
//         );
//         res.status(200).json({
//           status: "ok",
//           message: "Project Updated Successfully",
//         });
//       } else {
//         res.status(404).json({ status: "error", message: "Project Not Found" });
//       }
//     } else if (title && endpoint && link && userID) {
//       // Handle case where no files are uploaded
//       const Project = await PortFolio_Projects.findById(req.params.id);
//       if (Project) {
//         const updatedData = {
//           isVisible: isVisible || true,
//           image: Project.image, // Keep existing images unchanged
//           title,
//           endpoint: JSON.parse(endpoint),
//           link,
//           userID,
//         };
//         const result = await PortFolio_Projects.findByIdAndUpdate(
//           req.params.id,
//           updatedData,
//           { new: true }
//         );
//         res.status(200).json({
//           status: "ok",
//           message: "Project Updated Successfully",
//         });
//       } else {
//         res.status(404).json({ status: "error", message: "Project Not Found" });
//       }
//     } else {
//       res.status(400).json({
//         status: "error",
//         message: "All fields are mandatory and at least one file is required",
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };
exports.updateProject = async (req, res, next) => {
  const { title, endpoint, link, userID, isVisible, credentials } = req.body;
  try {
    if (title && endpoint && link && userID && req.file) {
      const Project = await PortFolio_Projects.findById(req.params.id);
      const imgID = Project.image.public_id;
      await cloudinary.uploader.destroy(imgID);

      if (Project) {
        const uploadRes = await cloudinary.uploader.upload(
          req.file.path,
          {
            upload_preset: "Portfolio_project",
          },
          (error, result) => {
            if (error) {
              return res.status(200).json({
                status: "error",
                message: "Image Should not exceed 70MB",
              });
            } else {
              return result;
            }
          }
        );
        const updatedData = {
          isVisible: isVisible || true,
          image: {
            public_id: uploadRes.public_id,
            url: uploadRes.secure_url,
          }, // Concatenate new images with existing ones
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
        res.status(200).json({
          status: "ok",
          message: "Project Updated Successfully",
        });
      } else {
        res.status(404).json({ status: "error", message: "Project Not Found" });
      }
    } else if (title && endpoint && link && userID) {
      // Handle case where no files are uploaded
      const Project = await PortFolio_Projects.findById(req.params.id);
      if (Project) {
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
        res.status(200).json({
          status: "ok",
          message: "Project Updated Successfully",
        });
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
