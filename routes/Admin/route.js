const express = require("express");
const {
  getAdmin,
  createAdmin,
  loginAdmin,
  checkAdmin,
  approveRetailer,
  rejectRetailer,
} = require("../../controllers/AdminController");
const verifyAuthToken = require("../../middlewares/verifyAuthToken");
const { getRetailers } = require("../../controllers/RetailerController");
const router = express.Router();

router.get("/", verifyAuthToken, getAdmin);
router.get("/checkAdmin", checkAdmin);
router.post("/create", createAdmin);
router.post("/login", loginAdmin);
router.put("/approveRetailer", verifyAuthToken, approveRetailer);
router.get("/all", verifyAuthToken, getRetailers);

router.delete("/rejectRetailer", verifyAuthToken, rejectRetailer);

module.exports = router;
