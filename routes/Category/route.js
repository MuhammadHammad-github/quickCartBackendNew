const express = require("express");
const verifyAuthToken = require("../../middlewares/verifyAuthToken");
const {
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
} = require("../../controllers/CategoryController");
const upload = require("../../middlewares/uploadFile");
const deleteFile = require("../../middlewares/deleteFile");
const optimizeImage = require("../../middlewares/optimizeImage");
const { Category } = require("../../models");
const router = express.Router();

const conditionalUpload = (req, res, next) => {
  if (req.headers["content-type"].startsWith("multipart/form-data")) {
    return upload.single("image")(req, res, next);
  }
  next();
};
const conditionalDelete = (Model) => {
  return (req, res, next) => {
    const contentType = req.headers["content-type"];

    if (contentType && contentType.startsWith("multipart/form-data")) {
      return deleteFile(Model)(req, res, next);
    }

    next();
  };
};

router.get("/", getCategories);
router.get("/one", getCategory);
router.post(
  "/create",
  verifyAuthToken,
  upload.single("image"),
  optimizeImage,
  createCategory
);
router.put(
  "/update",
  verifyAuthToken,
  conditionalUpload,
  optimizeImage,
  conditionalDelete(Category),
  updateCategory
);
router.delete("/delete", verifyAuthToken, deleteFile(Category), deleteCategory);

module.exports = router;
