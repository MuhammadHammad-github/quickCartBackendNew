const { create, getAccount, login } = require("../utils/authCrud");
const { Buyer } = require("../models/");
const { update } = require("../utils");
const { readTotal, read } = require("../utils/crud");

const createBuyer = async (req, res) => {
  await create(res, req.body, Buyer);
};
const loginBuyer = async (req, res) => {
  await login(res, req.body, Buyer);
};
const getBuyer = async (req, res) => {
  await getAccount(res, { id: req.id }, Buyer);
};
const getBuyers = async (req, res) => {
  await read(res, {}, Buyer, []);
};
const getTotalBuyers = async (req, res) => {
  await readTotal(res, Buyer);
};
const updateBuyer = async (req, res) => {
  await update(res, req.body, Buyer, req.id);
};

module.exports = {
  createBuyer,
  getBuyer,
  loginBuyer,
  updateBuyer,
  getTotalBuyers,
  getBuyers,
};
