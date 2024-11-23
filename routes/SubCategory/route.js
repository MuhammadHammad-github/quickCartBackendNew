const express = require("express");
const verifyAuthToken = require("../../middlewares/verifyAuthToken");
const {
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getSubCategories,
  getSubCategoriesByCategory,
} = require("../../controllers/SubCategoryController");
const upload = require("../../middlewares/uploadFile");
const deleteFile = require("../../middlewares/deleteFile");
const { SubCategory } = require("../../models");
const optimizeImage = require('../../middlewares/optimizeImage')

const router = express.Router();

const conditionalUpload = (req, res, next) => {
  const contentType = req.headers["content-type"];

  if (contentType && contentType.startsWith("multipart/form-data")) {
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

router.get("/", getSubCategories);
router.get("/byCategory", getSubCategoriesByCategory);
router.get("/one", getSubCategory);
router.post(
  "/create",
  verifyAuthToken,
  upload.single("image"),
  optimizeImage,

  createSubCategory
);
router.put(
  "/update",
  verifyAuthToken,
  conditionalUpload,
  optimizeImage,

  conditionalDelete(SubCategory),
  updateSubCategory
);
router.delete(
  "/delete",
  verifyAuthToken,
  deleteFile(SubCategory),
  deleteSubCategory
);

module.exports = router;
