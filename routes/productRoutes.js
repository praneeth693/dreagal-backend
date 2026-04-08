const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
      filename: function (req, file, cb) {
  cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });



router.post("/", upload.single("image"), async (req, res) => {
  try {

    const product = new Product({
       title: req.body.title,
      price: req.body.price,
      category: req.body.category,
      image: req.file.filename
    });

    await product.save();

    res.json(product);

  } catch (error) {
        res.status(500).json({ message: error.message });
  }
});


router.get("/", async (req, res) => {

  const products = await Product.find();

  res.json(products);

});


router.get("/:id", async (req, res) => {

  const product = await Product.findById(req.params.id);

  res.json(product);

});


router.put("/:id", upload.single("image"),async (req, res) => {
  try {

      
    console.log("Body:", req.body);
    console.log("FILE:",req.file);
    const updatedData=
      {
        title: req.body.title,
        price: req.body.price,
         category: req.body.category
      };
    if(req.file){
      updatedData.image=req.file.filename;
    }

    const updatedProduct=await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { returnDocument: "after" }

    );




     
  

    res.json(updatedProduct);

  } catch (error) {
    console.log(error);
    res.status(500).json({  message: error.message });
  }
});


router.delete("/:id", async (req, res) => {

  await Product.findByIdAndDelete(req.params.id);

  res.json({ message: "Deleted" });

});

module.exports = router;