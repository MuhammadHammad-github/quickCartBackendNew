const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const retailerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    storeName: { type: String, required: true },
    storeAddress: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    allowed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Retailer", retailerSchema);
