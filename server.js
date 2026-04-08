
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Razorpay=require("razorpay");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();
app.set("trust proxy",1);
app.use(cors({
  origin:"",
  credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({ extended:true}));

const razorpay=new Razorpay({
  key_id:"rzp_test_SYDb9gIxkE4TDc",
  key_secret:"4EK21TaLTP83LJzjb6ViIN6k",
});
app.post("/create-order",async(req,res)=>{
  try{
    const{amount}=req.body;
    const options={
      amount:amount*100,
      currency:"INR",
      receipt:"order_"+Date.now(),
    };
    const order=await razorpay.orders.create(options);
    res.json(order);
  }
  catch(error){
    console.log(error);
    res.status(500).send("Errro creating order");
  }
});
app.use("/uploads",express.static(path.join(__dirname,"uploads")));

mongoose.connect(process.env.MONGO_URI)
  .then(()=>{
    console.log("database Connected");
  })
  .catch((err)=>{
    console.log("MongoDB Error:",err);
  })
app.use((req,res,next)=>{
  res.set("cache-Control","no-Store");
  next();
});
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);


app.get("/",(req,res)=>{
  res.send("Server Running");
});
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  console.log("Database Connected");
})
.catch((err)=>{
  console.log("MongoDB Error:",err);
});
const PORT=process.env.PORT||5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});