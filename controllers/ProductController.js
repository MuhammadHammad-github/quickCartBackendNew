const { Product, Category, SubCategory } = require("../models/");
const {
  update,
  create,
  readOne,
  deleteItem,
  readBy,
  response,
  pushUpdate,
  pullUpdate,
  read,
  tryCatchError,
} = require("../utils");
const { readTotal } = require("../utils/crud");

const createProduct = async (req, res) => {
  const forwardedProto = req.get("X-Forwarded-Proto") || "";
  const protocol = forwardedProto.split(",")[0]?.trim() || req.protocol;
  const fullUrl = protocol + "://" + req.get("host");
  const optimizedFilePaths = req.optimizedImagePaths;
  if (!optimizedFilePaths || optimizedFilePaths.length === 0)
    return response(res, 404, { message: "File Not Uploaded!" });
  const filePaths = optimizedFilePaths.map((file) => {
    return `${fullUrl}/${file.replace(/\\/g, "/")}`;
  });

  const product = await create(
    res,
    {
      ...req.body,
      retailer: req.id,
      images: filePaths,
      colors: req.body.colors ? req.body.colors.split(",") : [],
    },
    Product,
    false
  );
  await pushUpdate(
    res,
    product._id,
    Category,
    product.category,
    "products",
    false
  );
  await pushUpdate(
    res,
    product._id,
    SubCategory,
    product.subCategory,
    "products",
    false
  );
  return response(res, 200, { message: "Created Successfully!" });
};
const getProduct = async (req, res) => {
  await readOne(res, { id: req.headers["id"] }, Product);
};
const getTotalProducts = async (req, res) => {
  await readTotal(res, Product);
};
const getTotalProductsByRetailer = async (req, res) => {
  if (!req.headers["id"])
    return response(res, 409, { message: "Retailer id not received" });
  await readTotal(res, Product, { retailer: req.headers["id"] });
};
const getProducts = async (req, res) => {
  await read(res, {}, Product, ["category", "subCategory"]);
};

const getProductsByRetailer = async (req, res) => {
  await readBy(res, { retailer: req.headers["id"] }, Product, [
    "category",
    "subCategory",
  ]);
};
const getProductsByCategory = async (req, res) => {
  await readBy(res, { category: req.headers["id"] }, Product, [
    "category",
    "subCategory",
  ]);
};
const getFeaturedProducts = async (req, res) => {
  await readBy(res, { featured: true }, Product);
};
const getPopularProducts = async (req, res) => {
  try {
    const topProducts = await Product.find({}).sort({ orders: -1 }).limit(9);
    return response(res, 200, { items: topProducts });
  } catch (error) {
    return tryCatchError(res, error);
  }
};
const getProductsBySubCategory = async (req, res) => {
  await readBy(res, { subCategory: req.headers["id"] }, Product, [
    "category",
    "subCategory",
  ]);
};
const updateProduct = async (req, res) => {
  try {
    const forwardedProto = req.get("X-Forwarded-Proto") || "";
    const protocol = forwardedProto.split(",")[0]?.trim() || req.protocol;
    const fullUrl = protocol + "://" + req.get("host");
    const files = req.files;
    const optimizedFilePaths = req.optimizedImagePaths || [];
    const filePaths = optimizedFilePaths.map((file) => {
      return `${fullUrl}/${file.replace(/\\/g, "/")}`;
    });

    // Proceed with the rest of the query
    const query = {
      ...req.body,
      colors: req.body.colors?.split(",") || [],
      ...(filePaths.length !== 0 && { images: filePaths }),
    };
    let productBeforeUpdate;
    if (req.body.category || req.body.subCategory)
      productBeforeUpdate = await Product.findById(req.headers["id"]).select(
        "category subCategory"
      );
    const product = await update(res, query, Product, req.headers["id"], false);

    if (req.body.category) {
      await pullUpdate(
        res,
        product._id,
        Category,
        productBeforeUpdate.category,
        "products",
        false
      );
      await pushUpdate(
        res,
        product._id,
        Category,
        product.category,
        "products",
        false
      );
    }

    if (req.body.subCategory) {
      await pullUpdate(
        res,
        product._id,
        SubCategory,
        productBeforeUpdate.subCategory,
        "products",
        false
      );
      await pushUpdate(
        res,
        product._id,
        SubCategory,
        product.subCategory,
        "products",
        false
      );
    }

    return response(res, 200, { message: "Data Updated!", product });
  } catch (error) {
    console.error("Error in updateProduct:", error);
    return response(res, 500, { message: "Internal Server Error", error });
  }
};

const featureUnFeatureProduct = async (req, res) => {
  try {
    const productId = req.headers["id"];
    if (!productId)
      return response(res, 400, { message: "Product Id Not Received!" });
    const product = await Product.findById(productId);
    if (!product)
      return response(res, 404, {
        message: "Product with this Id not found!",
      });
    await Product.findByIdAndUpdate(productId, { featured: !product.featured });
    return response(res, 200, {
      message: `Product ${product.featured ? "UnFeatured" : "Featured"} `,
    });
  } catch (error) {
    tryCatchError(res, error);
  }
};
const deleteProduct = async (req, res) => {
  const subCatResp = await pullUpdate(
    res,
    req.headers["id"],
    SubCategory,
    req.headers["subcategory"],
    "products",
    false
  );
  if (subCatResp.success === false)
    return response(res, subCatResp.status, { message: subCatResp.message });
  const catResp = await pullUpdate(
    res,
    req.headers["id"],
    Category,
    req.headers["category"],
    "products",
    false
  );
  if (catResp.success === false)
    return response(res, catResp.status, { message: catResp.message });

  await deleteItem(res, { id: req.headers["id"] }, Product);
};
module.exports = {
  createProduct,
  getProduct,
  updateProduct,
  getProductsByRetailer,
  deleteProduct,
  getProductsByCategory,
  getProductsBySubCategory,
  getProducts,
  getTotalProducts,
  getTotalProductsByRetailer,
  featureUnFeatureProduct,
  getFeaturedProducts,
  getPopularProducts,
};
