const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());
const dotenv = require("dotenv");
const projects = require("./routes/projects");
const profile = require("./routes/profile");
const resume = require("./routes/resume");
const auth = require("./routes/auth");
const contact = require("./routes/Contacts/index");
const contact_Msg = require("./routes/Contacts/msg");
const credentials = require("./routes/credentials");
const multer = require("multer");
const Grid = require("gridfs-stream");
dotenv.config();
const { GridFSBucket, MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`SERVER STARTED ${PORT}`);
});
const MONGO = process.env.MONGODB;

app.use("/portfolio/projects", projects);
app.use("/portfolio/resume", resume);
app.use("/portfolio/auth", auth);
app.use("/portfolio/profile", profile);
app.use("/portfolio/contact", contact);
app.use("/portfolio/contact/msg", contact_Msg);
app.use("/portfolio/credentials", credentials);
// app.use("/portfolio/Public", express.static(path.join(__dirname, "Public")));
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "PORTFOLIO Server Connected" });
});

mongoose
  .connect(MONGO)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const client = new MongoClient(MONGO);

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  const userID = req.query.userID;

  try {
    const db = client.db("test"); // Replace with your database name
    const bucket = new GridFSBucket(db);

    const filename = req.file.originalname;
    const fileBuffer = req.file.buffer;

    const uploadStream = bucket.openUploadStream(filename, {
      metadata: {
        userID: userID,
      },
    });

    const fileId = uploadStream.id;
    let uploadedBytes = 0;
    const fileSize = fileBuffer.length;

    // Track progress of the upload
    uploadStream.on("data", (chunk) => {
      uploadedBytes += chunk.length;
      const progress = Math.round((uploadedBytes / fileSize) * 100);
      console.log(`Progress: ${progress}%`);
      // You could emit a progress event here or store it to update client-side
    });

    uploadStream.end(fileBuffer);

    uploadStream.on("finish", () => {
      console.log(`File ${filename} uploaded successfully with id: ${fileId}`);
      res
        .status(200)
        .send(`File ${filename} uploaded successfully with id: ${fileId}`);
    });

    uploadStream.on("error", (err) => {
      console.error("Error uploading file to MongoDB Atlas:", err);
      res.status(500).send("Error uploading file to MongoDB Atlas");
    });
  } catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err);
    res.status(500).send("Error connecting to MongoDB Atlas");
  }
});
app.get("/files", async (req, res) => {
  try {
    const db = client.db("test"); // Replace with your database name
    const filesCollection = db.collection("fs.files");

    // Fetch all files
    const files = await filesCollection.find().toArray();

    // Extract filenames and IDs
    const fileMetadata = files.map((file) => ({
      filename: file.filename,
      fileId: file._id,
      metadata: file.metadata,
    }));

    res.json(fileMetadata);
  } catch (err) {
    console.error("Error retrieving files from MongoDB Atlas:", err);
    res.status(500).send("Error retrieving files from MongoDB Atlas");
  }
});
app.get("/download/:id", async (req, res) => {
  try {
    const db = client.db("test"); // Replace with your database name
    const bucket = new GridFSBucket(db);

    const fileId = new ObjectId(req.params.id);

    // Find the file by ID
    const file = await db.collection("fs.files").findOne({ _id: fileId });
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Set appropriate headers for file download
    res.set("Content-Type", file.contentType);
    res.set("Content-Disposition", `attachment; filename="${file.filename}"`);

    // Stream the file to the response
    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.pipe(res);
  } catch (err) {
    console.error("Error downloading file from MongoDB Atlas:", err);
    res.status(500).send("Error downloading file from MongoDB Atlas");
  }
});
app.delete("/file/:id", async (req, res) => {
  try {
    const db = client.db("test"); // Replace with your database name
    const bucket = new GridFSBucket(db);

    const fileId = new ObjectId(req.params.id);

    // Delete the file from GridFS
    await bucket.delete(fileId);

    res.status(200).send(`File with ID ${fileId} deleted successfully`);
  } catch (err) {
    console.error("Error deleting file from MongoDB Atlas:", err);
    res.status(500).send("Error deleting file from MongoDB Atlas");
  }
});
// Route to handle file retrieval by filename
app.get("/fileByName/:name", async (req, res) => {
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
});
