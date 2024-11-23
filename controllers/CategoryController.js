const { Category, Product, SubCategory } = require("../models/");
const {
  update,
  create,
  readOne,
  deleteItem,
  deleteManyItems,
  read,
} = require("../utils");
const { deletingImages } = require("../utils/crud");

const createCategory = async (req, res) => {
  const fullUrl = req.protocol + "://" + req.get("host");
  if (!req.file) return response(res, 404, { message: "File Not Uploaded!" });
  const filePath = req.file.path.replace(/\\/g, "/");
  await create(
    res,
    { ...req.body, retailer: req.id, image: `${fullUrl}/${filePath}` },
    Category
  );
};
const getCategories = async (req, res) => {
  await read(res, {}, Category, ["subCategories"]);
};
const getCategory = async (req, res) => {
  await readOne(res, { id: req.headers["id"] }, Category);
};

const updateCategory = async (req, res) => {
  const fullUrl = req.protocol + "://" + req.get("host");
  let query;
  if (req.file) {
    const filePath = req.file.path.replace(/\\/g, "/");

    query = {
      ...req.body,
      image: `${fullUrl}/${filePath}`,
    };
  } else query = req.body;
  await update(res, query, Category, req.headers["id"]);
};
const deleteCategory = async (req, res) => {
  await deletingImages(
    res,
    req,
    Product,
    "category",
    req.headers["id"],
    "images"
  );
  await deleteManyItems(
    res,
    {
      id: req.headers["id"],
      deleteBy: "category",
    },
    Product,
    false
  );
  await deletingImages(
    res,
    req,
    SubCategory,
    "parentCategory",
    req.headers["id"]
  );
  await deleteManyItems(
    res,
    {
      id: req.headers["id"],
      deleteBy: "parentCategory",
    },
    SubCategory,
    false
  );

  await deleteItem(res, { id: req.headers["id"] }, Category);
};
module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategories,
};
