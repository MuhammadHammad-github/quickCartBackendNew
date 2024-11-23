const express = require("express");
const verifyAuthToken = require("../../middlewares/verifyAuthToken");
const {
  getRetailer,
  createRetailer,
  updateRetailer,
  loginRetailer,
  getRetailers,
  getUnapprovedRetailers,
  getTotalRetailers,
} = require("../../controllers/RetailerController");

const router = express.Router();
router.post("/create", createRetailer);
router.post("/login", loginRetailer);
router.get("/", verifyAuthToken, getRetailer);
router.get("/all", getRetailers);
router.get("/total", getTotalRetailers);
router.get("/unapproved", verifyAuthToken, getUnapprovedRetailers);
router.post("/update", verifyAuthToken, updateRetailer);
module.exports = router;
