const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

router.post("/", async (req, res) => {

  try {

    const item = new Cart(req.body);
 await item.save();

    res.json(item);

  } catch (error) {

        res.status(500).json({ message: error.message });

  }

});

router.get("/", async (req, res) => {

  const items = await Cart.find();

  res.json(items);

});


router.delete("/:id", async (req, res) => {

  await Cart.findByIdAndDelete(req.params.id);

  res.json({ message: "Item removed" });

});

module.exports = router;