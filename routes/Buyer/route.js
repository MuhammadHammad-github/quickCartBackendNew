const express = require("express");
const verifyAuthToken = require("../../middlewares/verifyAuthToken");
const {
  getBuyer,
  createBuyer,
  loginBuyer,
  updateBuyer,
  getTotalBuyers,
  getBuyers,
} = require("../../controllers/BuyerController");

const router = express.Router();
router.get("/", verifyAuthToken, getBuyer);
router.get("/all", getBuyers);
router.get("/total", getTotalBuyers);
router.post("/create", createBuyer);
router.post("/login", loginBuyer);
router.put("/update", verifyAuthToken, updateBuyer);
module.exports = router;
