const express = require("express");
const verifyAuthToken = require("../../middlewares/verifyAuthToken");
const {
  getOrder,
  createOrder,

  updateOrder,
  getOrdersByBuyer,
  getOrdersByRetailer,
  getTotalOrdersByRetailer,
  getTotalCompletedOrdersByRetailer,
  getTotalPendingOrdersByRetailer,
  createCheckoutSession,
  getCheckoutSession,
  getTotalPendingOrdersByBuyer,
  getTotalOrdersByBuyer,
} = require("../../controllers/OrderController");
const router = express.Router();
router.get("/", getOrder);
router.get("/buyerOrders", verifyAuthToken, getOrdersByBuyer);
router.get("/retailerOrders", verifyAuthToken, getOrdersByRetailer);
router.get("/totalRetailerOrders", verifyAuthToken, getTotalOrdersByRetailer);
router.get(
  "/totalCompletedOrdersByRetailer",
  verifyAuthToken,
  getTotalCompletedOrdersByRetailer
);
router.get(
  "/totalPendingOrdersByRetailer",
  verifyAuthToken,
  getTotalPendingOrdersByRetailer
);
router.get("/totalOrdersByBuyer", verifyAuthToken, getTotalOrdersByBuyer);
router.get(
  "/totalPendingOrdersByBuyer",
  verifyAuthToken,
  getTotalPendingOrdersByBuyer
);
router.post("/create", verifyAuthToken, createOrder);
router.post("/createCheckoutSession", verifyAuthToken, createCheckoutSession);
router.get(
  "/getCheckoutSession/:sessionId",
  verifyAuthToken,
  getCheckoutSession
);
router.post("/update", verifyAuthToken, updateOrder);
module.exports = router;
