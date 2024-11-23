const fs = require("fs");
const path = require("path");
const deleteFileFn = async (relativePath, res) => {
  const absoluteFilePath = path.join(__dirname, "..", relativePath);
  if (fs.existsSync(absoluteFilePath)) {
    fs.unlink(absoluteFilePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return { message: 500, message: "Error Deleting File" };
      }
    });
  } else {
    console.error("File not found:", absoluteFilePath);
  }
};
const mappingPaths = async (filePaths, req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  if (Array.isArray(filePaths)) {
    // If multiple files, iterate and delete each
    await Promise.all(
      filePaths.map(async (filePath) => {
        const relativePath = filePath.replace(baseUrl, "");
        await deleteFileFn(relativePath, res);
      })
    );
  } else {
    // If only one file (string), delete it
    const relativePath = filePaths.replace(baseUrl, "");
    await deleteFileFn(relativePath);
  }
};
module.exports = { deleteFileFn, mappingPaths };
