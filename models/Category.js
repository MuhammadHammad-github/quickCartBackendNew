const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    subCategories: [{ type: Schema.Types.ObjectId, ref: "SubCategory" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
