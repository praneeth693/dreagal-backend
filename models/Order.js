const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    _id: String,
    name: String,
    email: String,
  },

  items: [
    {
      title: String,
      price: Number,
      quantity: Number,
      image: String,
      category: String,
    },
  ],

  total: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    default: "Completed",
  },

  paymentId: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);