require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const httpProxy = require('http-proxy');
const { connectToDb } = require("./utils");
const {
  adminRoute,
  buyerRoute,
  orderRoute,
  productRoute,
  retailerRoute,
  subCategoryRoute,
  categoryRoute,
  slideRoute,
} = require("./routes");
const app = express();

const proxy = httpProxy.createProxyServer();
const servers = [
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003'
];
connectToDb();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/admin", adminRoute);
app.use("/api/slide", slideRoute);
app.use("/api/buyer", buyerRoute);
app.use("/api/order", orderRoute);
app.use("/api/product", productRoute);
app.use("/api/retailer", retailerRoute);
app.use("/api/category", categoryRoute);
app.use("/api/subCategory", subCategoryRoute);

app.listen(3000, () => {
  console.log("server started at port 3000");
});
