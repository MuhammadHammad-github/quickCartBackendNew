const { Order, Product } = require("../models/");
const {
  update,
  create,
  readOne,
  read,
  response,
  tryCatchError,
} = require("../utils");
const { readBy, readTotal, pushUpdate } = require("../utils/crud");
const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51NwQW5GeNInzyjCWP4vx1FWJRffBEEt71rPGtXF5iomcivZ9b4qajWU5Paegcv0knj0oPP3mZG7UFnfpsKmWmLUs00wjMPH9Yk"
);
const createOrder = async (req, res) => {
  try {
    const { products } = req.body;
    const fetchedProducts = await Promise.all(
      products.map((productObj) => Product.findById(productObj.product))
    );
    const retailers = fetchedProducts.map((product) => product.retailer);
    const newOrder = await create(
      res,
      { ...req.body, buyer: req.id, retailer: retailers },
      Order,
      false
    );
    await Promise.all(
      products.map((productObj) => {
        pushUpdate(
          res,
          newOrder._id,
          Product,
          productObj.product,
          "orders",
          false
        );
      })
    );
    return response(res, 200, { message: "Order Created" });
  } catch (error) {
    return tryCatchError(res, error);
  }
};
const getOrder = async (req, res) => {
  await readOne(res, { id: req.headers["id"] }, Order);
};
const getOrdersByBuyer = async (req, res) => {
  await readBy(res, { buyer: req.id }, Order, ["buyer", "products.product"]);
};
const getTotalOrdersByBuyer = async (req, res) => {
  await readTotal(res, Order, { buyer: req.id });
};
const getTotalPendingOrdersByBuyer = async (req, res) => {
  await readTotal(res, Order, { buyer: req.id, status: "pending" });
};
const getTotalOrdersByRetailer = async (req, res) => {
  await readTotal(res, Order, { retailer: req.id });
};
const getTotalCompletedOrdersByRetailer = async (req, res) => {
  await readTotal(res, Order, { retailer: req.id, status: "delivered" });
};
const createCheckoutSession = async (req, res) => {
  try {
    const { success_url, cancel_url, items } = req.body;
    const productIds = items.map((item) => item.productId);
    const colors = items.map((item) => item.color);
    const products = await Promise.all(
      productIds.map((id) => Product.findById(id))
    );
    const combinedItems = items.map((item) => {
      const product = products.find(
        (prod) => prod._id.toString() === item.productId
      );
      return { ...item, product };
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: combinedItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: `${item.product.name} (Color: ${item.color})`,
          },
          unit_amount: item.product.salePrice * 100,
        },
        quantity: item.numberOfItems,
      })),
      mode: "payment",
      success_url,
      cancel_url,
      metadata: {
        productIds: productIds.join(","),
        colors: colors.join(","),
      },
    });
    return response(res, 200, { message: "Session Created!", id: session.id });
  } catch (error) {
    console.log(error.message);
    return response(res, 500, { message: "Internal Server error" });
  }
};
const getCheckoutSession = async (req, res) => {
  const { sessionId } = req.params;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
    return response(res, 200, { session: session });
  } catch (error) {
    console.log(error.message);
    return response(res, 500, { message: "Internal Server error" });
  }
};
const getTotalPendingOrdersByRetailer = async (req, res) => {
  await readTotal(res, Order, {
    retailer: req.id,
    status: { $nin: ["delivered", "canceled", "shipped"] },
  });
};
const getOrdersByRetailer = async (req, res) => {
  await readBy(res, { retailer: req.id }, Order, ["buyer", "products.product"]);
};
const updateOrder = async (req, res) => {
  await update(res, req.body, Order, req.headers["id"]);
};
module.exports = {
  createOrder,
  getOrder,
  updateOrder,
  getOrdersByBuyer,
  getOrdersByRetailer,
  getTotalOrdersByRetailer,
  getTotalCompletedOrdersByRetailer,
  getTotalPendingOrdersByRetailer,
  createCheckoutSession,
  getCheckoutSession,
  getTotalOrdersByBuyer,
  getTotalPendingOrdersByBuyer,
};
