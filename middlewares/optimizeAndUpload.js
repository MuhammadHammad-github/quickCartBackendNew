const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

// Set memory storage
const storage = multer.memoryStorage();

// Initialize upload (single or multiple)
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size (optional)
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

const optimizeImage = async (req, res, next) => {
  const files = req.files || (req.file ? [req.file] : []);

  if (files.length === 0) {
    console.log("Skipping Optimizing: No file received");
    next();
    return;
  }

  try {
    const optimizedPaths = [];
    for (const file of files) {
      const fileBuffer = file.buffer; // Get the file buffer
      const outputFileName = `uploads/${Date.now()}-${file.originalname.replace(
        /\s+/g,
        "_"
      )}.webp`;

      // Use Sharp to optimize the image and save it
      await sharp(fileBuffer)
        .resize(800) // Example resizing (optional)
        .toFormat("webp", { quality: 80 }) // Convert to webp and set quality
        .toFile(outputFileName);

      console.log(`Image optimized and saved as: ${outputFileName}`);
      optimizedPaths.push(outputFileName); // Store the path for each file
    }

    req.optimizedImagePaths = optimizedPaths; // Pass file paths to the next middleware
    next();
  } catch (err) {
    console.error(`Error optimizing images: ${err.message}`);
    return res.status(500).send("Error processing images.");
  }
};

module.exports = { upload, optimizeImage };
