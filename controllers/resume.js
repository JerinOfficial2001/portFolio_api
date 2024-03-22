const { PortFolio_Resume } = require("../models/Resume");
const cloudinary = require("../utils/cloudinary");

exports.addResume = async (req, res) => {
  const { userID, isVisible } = req.body;
  try {
    if (!userID) {
      return res
        .status(200)
        .json({ status: "error", message: "UserID is required" });
    } else if (req.file) {
      const newVal = new PortFolio_Resume({
        pdf: { name: req.file.originalname, data: req.file.path },
        userID,
        isVisible: isVisible ? isVisible : true,
      });
      const result = await newVal.save();
      res.status(200).json({ status: "ok", data: result });
      // const uploadRes = await cloudinary.uploader.upload(
      //   req.file.path,
      //   {
      //     upload_preset: "Portfolio_resume",
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
      // if (uploadRes) {
      //   const newVal = new PortFolio_Resume({
      //     image: { url: uploadRes.secure_url, public_id: uploadRes.public_id },
      //     userID,
      //     isVisible: isVisible ? isVisible : true,
      //   });
      //   const result = await newVal.save();
      //   res.status(200).json({ status: "ok", data: result });
      // }
    }
  } catch (error) {
    console.log(error);
  }
};
exports.getResume = async (req, res) => {
  try {
    const result = await PortFolio_Resume.findOne({ userID: req.params.id });
    if (result) {
      // res.setHeader(
      //   "Content-Disposition",
      //   `attachment; filename="${result.pdf.name}"`
      // );

      res.setHeader("Content-Type", "application/pdf");
      res.send(result.pdf.data);
    } else {
      res.status(200).json({ status: "error", message: "No data found" });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.updateResume = async (req, res) => {
  try {
    const resume = await PortFolio_Resume.findById(req.params.id);
    const imgID = resume.image.public_id;
    if (imgID) {
      await cloudinary.uploader.destroy(imgID);
    }
    const newImg = await cloudinary.uploader.upload(req.file.path, {
      upload_preset: "Portfolio_resume",
    });
    resume.image = {
      public_id: newImg.public_id,
      url: newImg.secure_url,
    };
    await PortFolio_Resume.findByIdAndUpdate(req.params.id, resume, {
      new: true,
    });
    res.send({ status: "ok", message: "Resume Updated successfully" });
  } catch (error) {
    console.log(error);
  }
};
