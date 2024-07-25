const { PortFolio_Projects } = require("../models/Projects/projects");
const { GridFSBucket, MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");

const {
  addWebsite,
  addApplication,
  updateWebsite,
  updateApplication,
} = require("../services/projects");
const cloudinary = require("../utils/cloudinary");
const Grid = require("gridfs-stream");
const BASE_URL = process.env.BASE_URL;
const MONGO = process.env.MONGODB;
const client = new MongoClient(MONGO);

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
    const isLoggedIn = req.query.isLoggedIn;
    const result = await PortFolio_Projects.find({
      userID: req.params.id,
      category: req.query.category,
    });
    if (result) {
      if (isLoggedIn != "false") {
        res.status(200).json({ status: "ok", data: result });
      } else {
        const visibleProjects = result.filter((elem) => elem.isVisible);
        res.status(200).json({ status: "ok", data: visibleProjects });
      }
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
      Project.isVisible = req.body.isVisible;
      const result = Project.save();
      if (result) {
        res.status(200).json({
          status: "ok",
          message: req.body.isVisible
            ? "Project visible to everyone"
            : "Project added to draft",
        });
      } else {
        res
          .status(200)
          .json({ status: "error", message: "Project not updated" });
      }
    } else {
      res.status(200).json({ status: "error", message: "Project Not Found" });
    }
  } catch (error) {
    next(error);
  }
};
exports.uploadApk = async (req, res) => {
  const userID = req.query.userID;
  const projectID = req.query.projectID;
  try {
    if (projectID) {
      const db = client.db("test");

      const filesCollection = db.collection("fs.files");
      const files = await filesCollection.find().toArray();
      const fileMetadata = files.map((file) => ({
        filename: file.filename,
        fileId: file._id,
        metadata: file.metadata,
      }));
      const bucket = new GridFSBucket(db);
      const myAPK = fileMetadata.find((i) => i.metadata.projectID == projectID);
      if (myAPK) {
        await bucket.delete(myAPK.fileId);
      }
      if (req.file) {
        const filename = req.file.originalname;
        const fileBuffer = req.file.buffer;

        const uploadStream = bucket.openUploadStream(filename, {
          metadata: {
            userID: userID,
            projectID: projectID,
          },
        });

        const fileId = uploadStream.id;
        let uploadedBytes = 0;
        const fileSize = fileBuffer.length;

        uploadStream.on("data", (chunk) => {
          uploadedBytes += chunk.length;
          const progress = Math.round((uploadedBytes / fileSize) * 100);
          console.log(`Progress: ${progress}%`);
        });

        uploadStream.end(fileBuffer);

        uploadStream.on("finish", () => {
          console.log(
            `File ${filename} uploaded successfully with id: ${fileId} to Project id:${projectID}`
          );
          res.status(200).json({ status: "ok", fileId, projectID });
        });

        uploadStream.on("error", (err) => {
          console.error("Error uploading file to MongoDB Atlas:", err);
          res.status(200).json({
            status: "ok",
            message: "Error uploading file to MongoDB Atlas",
          });
        });
      } else {
        res.status(200).json({ status: "error", message: "Invalid file" });
      }
    } else {
      res.status(200).json({ status: "error", message: "Project Id required" });
    }
  } catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err);
    res.status(500).send("Error connecting to MongoDB Atlas");
  }
};
exports.getApk = async (req, res) => {
  const projectID = req.query.projectID;

  try {
    const db = client.db("test");
    const filesCollection = db.collection("fs.files");

    const files = await filesCollection.find().toArray();

    const fileMetadata = files.map((file) => ({
      filename: file.filename,
      fileId: file._id,
      metadata: file.metadata,
    }));
    const apk = fileMetadata.find((i) => i.metadata.projectID == projectID);
    if (apk) {
      res.status(200).json({ status: "ok", data: apk });
    } else {
      res.status(200).json({ status: "error", message: "File not found" });
    }
  } catch (err) {
    console.error("Error retrieving files from MongoDB Atlas:", err);
    res.status(500).send("Error retrieving files from MongoDB Atlas");
  }
};
exports.downloadAPK = async (req, res) => {
  try {
    const db = client.db("test");
    const bucket = new GridFSBucket(db);
    const ID = req.params.id;
    const fileId = new ObjectId(ID);

    const file = await db.collection("fs.files").findOne({ _id: fileId });
    if (!file) {
      return res
        .status(200)
        .json({ status: "error", message: "File not found" });
    }

    res.set("Content-Type", file.contentType);
    res.set("Content-Disposition", `attachment; filename="${file.filename}"`);

    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.pipe(res);
  } catch (err) {
    console.error("Error downloading file from MongoDB Atlas:", err);
    res.status(500).send("Error downloading file from MongoDB Atlas");
  }
};
exports.deleteAPK = async (req, res) => {
  try {
    const db = client.db("test"); // Replace with your database name
    const bucket = new GridFSBucket(db);

    const fileId = new ObjectId(req.params.id);

    // Delete the file from GridFS
    await bucket.delete(fileId);

    res.status(200).json({
      status: "ok",
      message: `File with ID ${fileId} deleted successfully`,
    });
  } catch (err) {
    console.error("Error deleting file from MongoDB Atlas:", err);
    res.status(500).send("Error deleting file from MongoDB Atlas");
  }
};
exports.getAPKbyName = async (req, res) => {
  try {
    const db = client.db("test"); // Replace with your database name
    const gfs = Grid(db, MongoClient);

    const filename = req.params.name;

    const downloadStream = gfs.createReadStream({ filename: filename });
    downloadStream.pipe(res);
  } catch (err) {
    console.error("Error retrieving file from MongoDB Atlas:", err);
    res.status(500).send("Error retrieving file from MongoDB Atlas");
  }
};
