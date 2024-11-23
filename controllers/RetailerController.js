const { Retailer } = require("../models/");
const { update, readBy } = require("../utils");
const { create, login, getAccount } = require("../utils/authCrud");
const { readTotal } = require("../utils/crud");

const createRetailer = async (req, res) => {
  await create(res, req.body, Retailer);
};
const loginRetailer = async (req, res) => {
  await login(res, req.body, Retailer);
};
const getRetailer = async (req, res) => {
  await getAccount(res, { id: req.id }, Retailer);
};
const getRetailers = async (req, res) => {
  await readBy(res, { allowed: true }, Retailer);
};
const getTotalRetailers = async (req, res) => {
  await readTotal(res, Retailer);
};
const getUnapprovedRetailers = async (req, res) => {
  await readBy(res, { allowed: false }, Retailer);
};
const updateRetailer = async (req, res) => {
  await update(res, req.body, Retailer, req.id);
};
module.exports = {
  createRetailer,
  getRetailer,
  loginRetailer,
  updateRetailer,
  getRetailers,
  getUnapprovedRetailers,
  getTotalRetailers,
};
