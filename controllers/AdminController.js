const { create, getAccount, login } = require("../utils/authCrud");
const { Admin, Retailer } = require("../models/");
const tryCatchError = require("../utils/tryCatchError");
const response = require("../utils/response");
const { read, update, deleteItem } = require("../utils");

const createAdmin = async (req, res) => {
  await create(res, req.body, Admin);
};
const loginAdmin = async (req, res) => {
  await login(res, req.body, Admin);
};
const checkAdmin = async (req, res) => {
  try {
    const admins = await Admin.find();
    if (admins.length === 0)
      return response(res, 404, { message: "No admin found!" });
    return response(res, 200, { message: "Admin Found!" });
  } catch (error) {
    tryCatchError(res, error);
  }
};
const getAdmin = async (req, res) => {
  await getAccount(res, { id: req.id }, Admin);
};
const approveRetailer = async (req, res) => {
  await update(res, { allowed: true }, Retailer, req.headers["id"]);
};
const rejectRetailer = async (req, res) => {
  await deleteItem(res, { id: req.headers["id"] }, Retailer);
};
module.exports = {
  createAdmin,
  getAdmin,
  loginAdmin,
  checkAdmin,
  approveRetailer,
  rejectRetailer,
};
