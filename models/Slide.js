const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const slideSchema = new Schema({
  image: { type: String, required: true },
  heading: { type: String, required: true },
  text: { type: String, required: true },
  link: { type: String, required: true },
});

module.exports = mongoose.model("Slide", slideSchema);
