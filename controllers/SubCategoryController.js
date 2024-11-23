const { SubCategory, Category, Product } = require("../models");
const {
  update,
  create,
  readOne,
  deleteItem,
  deleteManyItems,
  read,
  pushUpdate,
  response,
  pullUpdate,
  tryCatchError,
  readBy,
} = require("../utils");
const { deletingImages } = require("../utils/crud");

const createSubCategory = async (req, res) => {
  try {
    const fullUrl = req.protocol + "://" + req.get("host");
    if (!req.file) return response(res, 404, { message: "File Not Uploaded!" });
    const filePath = req.file.path.replace(/\\/g, "/");
    const subCategory = await create(
      res,
      { ...req.body, image: `${fullUrl}/${filePath}` },
      SubCategory,
      false
    );
    console.log(subCategory, "this is sub category");
    if (!subCategory)
      return response(res, 400, { message: "Fail to create sub category" });
    const resp = await pushUpdate(
      res,
      subCategory._id,
      Category,
      subCategory.parentCategory,
      "subCategories",
      false
    );
    return response(res, resp.success ? 200 : resp.status, {
      message: resp.success ? "Created Successfully!" : resp.message,
    });
  } catch (error) {
    tryCatchError(res, error);
  }
};
const getSubCategory = async (req, res) => {
  await readOne(res, { id: req.headers["id"] }, SubCategory);
};
const getSubCategories = async (req, res) => {
  await read(res, {}, SubCategory);
};
const getSubCategoriesByCategory = async (req, res) => {
  await readBy(res, { parentCategory: req.headers["id"] }, SubCategory);
};
const updateSubCategory = async (req, res) => {
  console.log("body", req.body);
  const fullUrl = req.protocol + "://" + req.get("host");
  let query;
  if (req.file) {
    const filePath = req.file.path.replace(/\\/g, "/");

    query = {
      ...req.body,
      image: `${fullUrl}/${filePath}`,
    };
  } else query = req.body;
  await update(res, query, SubCategory, req.headers["id"]);
};
const deleteSubCategory = async (req, res) => {
  await pullUpdate(
    res,
    req.headers["id"],
    Category,
    req.headers["category"],
    "subCategories",
    false
  );
  await deletingImages(
    res,
    req,
    Product,
    "subCategory",
    req.headers["id"],
    "images"
  );
  await deleteManyItems(
    res,
    {
      id: req.headers["id"],
      deleteBy: "subCategory",
    },
    Product,
    false
  );
  await deleteItem(res, { id: req.headers["id"] }, SubCategory);
};
module.exports = {
  createSubCategory,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getSubCategories,
  getSubCategoriesByCategory,
};
