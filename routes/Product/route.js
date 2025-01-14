const express = require("express");
const verifyAuthToken = require("../../middlewares/verifyAuthToken");
const {
  getProduct,
  createProduct,
  updateProduct,
  getProductsByRetailer,
  deleteProduct,
  getProductsByCategory,
  getProductsBySubCategory,
  getProducts,
  getTotalProducts,
  getTotalProductsByRetailer,
  featureUnFeatureProduct,
  getFeaturedProducts,
  getPopularProducts,
} = require("../../controllers/ProductController");
// const upload = require("../../middlewares/uploadFile");
const deleteFile = require("../../middlewares/deleteFile");
const { Product } = require("../../models");
const apicache = require("apicache");
// const optimizeImage = require("../../middlewares/optimizeImage");
const {
  upload,
  optimizeImage,
} = require("../../middlewares/optimizeAndUpload");
const { mappingPaths } = require("../../utils/deleteFileFn");
const cache = apicache.middleware;
const router = express.Router();

const conditionalUpload = (req, res, next) => {
  console.log("Header", req.headers["content-type"]);
  if (req.headers["content-type"].startsWith("multipart/form-data")) {
    return upload.array("images")(req, res, next);
  }
  next();
};
const conditionalDelete = (Model) => {
  return (req, res, next) => {
    const contentType = req.headers["content-type"];

    if (
      contentType &&
      contentType.startsWith("multipart/form-data") &&
      req.body.imagesToDelete
    ) {
      // return deleteFile(Model)(req, res, next);
      mappingPaths(req.body.imagesToDelete, req, res);
    }

    next();
  };
};

router.get("/", getProduct);
router.get("/all", getProducts);
router.get("/totalProducts", getTotalProducts);
router.get("/totalProductsByRetailer", getTotalProductsByRetailer);
router.get("/retailerProducts", getProductsByRetailer);
router.get("/byCategory", getProductsByCategory);
router.get("/bySubCategory", getProductsBySubCategory);
router.get("/featured", getFeaturedProducts);
router.get("/popular", getPopularProducts);
router.post(
  "/create",
  verifyAuthToken,
  upload.array("images", 5),
  optimizeImage,
  createProduct
);
router.put(
  "/update",
  verifyAuthToken,

  conditionalUpload,
  optimizeImage,
  conditionalDelete(Product),
  updateProduct
);
router.delete("/delete", verifyAuthToken, deleteFile(Product), deleteProduct);
router.put("/featureUnFeature", verifyAuthToken, featureUnFeatureProduct);

module.exports = router;
