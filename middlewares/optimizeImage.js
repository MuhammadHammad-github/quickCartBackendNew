const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

const optimizeImage = async (req, res, next) => {
  try {
    // Check if it's a single file or multiple files
    if (req.file) {
      // Single file case
      const file = req.file;
      const inputPath = file.path;
      const outputPath = path.join(
        path.dirname(inputPath),
        `${Date.now()}-${path.parse(file.originalname).name}-optimized.webp`
      );

      // Optimize the single image
      await sharp(inputPath)
        .resize(1000) // Resize to a max width of 1000px (optional)
        .webp({ quality: 80 }) // Convert to WebP with 80% quality
        .toFile(outputPath);

      // Remove the original file after conversion
      fs.unlinkSync(inputPath);

      // Update file info in the request object
      file.path = outputPath;
      file.filename = path.basename(outputPath);
    } else if (req.files && Array.isArray(req.files)) {
      // Multiple files case
      const optimizedFiles = await Promise.all(
        req.files.map(async (file) => {
          const inputPath = file.path;
          const outputPath = path.join(
            path.dirname(inputPath),
            `${Date.now()}-${path.parse(file.originalname).name}-optimized.webp`
          );

          // Optimize the image
          await sharp(inputPath)
            .resize(1000)
            .webp({ quality: 80 })
            .toFile(outputPath);

          // Remove the original file after conversion
          fs.unlinkSync(inputPath);

          // Return updated file info
          return {
            ...file,
            path: outputPath,
            filename: path.basename(outputPath),
          };
        })
      );

      // Update the request object with optimized files
      req.files = optimizedFiles;
    }

    next();
  } catch (error) {
    console.error("Image optimization error:", error);
    res.status(500).json({ message: "Failed to process images" });
  }
};

module.exports = optimizeImage;
