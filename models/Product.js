const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: { type: String, required: true },

    description: { type: String, required: true },
    details: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    stock: { type: Number, required: true },
    images: [{ type: String, required: true }],
    colors: [{ type: String, required: false }],
    retailer: { type: Schema.Types.ObjectId, ref: "Retailer", required: true },
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
