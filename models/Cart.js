const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },

  title: String,
  price: Number,
  image: String,
  quantity: {
    type: Number,
    default: 1
  }

}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);