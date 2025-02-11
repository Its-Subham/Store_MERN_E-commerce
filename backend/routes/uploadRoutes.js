import path from "path";
import express from "express";
import multer from "multer";
import fs from "fs";
import uploadOnCloudinary from "../utils/cloudinary.js"; // Adjust the path as needed

const router = express.Router();

// Ensure the uploads directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpe?g|png|webp/;
  const allowedMimeTypes = /image\/jpe?g|image\/png|image\/webp/;
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (allowedExtensions.test(extname) && allowedMimeTypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images (JPEG, PNG, WebP) are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (req.file) {
      const localFilePath = req.file.path;
      // Upload the file to Cloudinary using your utility function
      const imageUrl = await uploadOnCloudinary(localFilePath);
      if (imageUrl) {
        // Remove the local file after a successful upload
        try {
          fs.unlinkSync(localFilePath);
        } catch (unlinkError) {
          console.error("Error deleting local file:", unlinkError);
        }
        return res.status(200).json({
          message: "Image uploaded successfully to Cloudinary",
          image: imageUrl,
        });
      } else {
        // Remove the local file even if Cloudinary upload fails, to avoid orphan files
        try {
          fs.unlinkSync(localFilePath);
        } catch (unlinkError) {
          console.error("Error deleting local file after failed upload:", unlinkError);
        }
        return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
      }
    } else {
      return res.status(400).json({ message: "No image file provided" });
    }
  });
});

export default router;
