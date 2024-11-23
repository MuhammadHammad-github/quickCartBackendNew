const Slide = require("../models/Slide");
const { update, create, deleteItem, read } = require("../utils");

const createSlide = async (req, res) => {
  const fullUrl = req.protocol + "://" + req.get("host");
  if (!req.file) return response(res, 404, { message: "File Not Uploaded!" });
  const filePath = req.file.path.replace(/\\/g, "/");
  await create(
    res,
    { ...req.body, retailer: req.id, image: `${fullUrl}/${filePath}` },
    Slide
  );
};
const getSlides = async (req, res) => {
  await read(res, {}, Slide);
};

const updateSlide = async (req, res) => {
  const fullUrl = req.protocol + "://" + req.get("host");
  let query;
  if (req.file) {
    const filePath = req.file.path.replace(/\\/g, "/");

    query = {
      ...req.body,
      image: `${fullUrl}/${filePath}`,
    };
  } else query = req.body;
  await update(res, query, Slide, req.headers["id"]);
};
const deleteSlide = async (req, res) => {
  await deleteItem(res, { id: req.headers["id"] }, Slide);
};
module.exports = {
  createSlide,
  updateSlide,
  deleteSlide,
  getSlides,
};
