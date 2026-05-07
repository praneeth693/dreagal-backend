const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: Object,
  items: Array,
  total: Number,
  status: String,
});

module.exports = mongoose.model("Order", orderSchema);