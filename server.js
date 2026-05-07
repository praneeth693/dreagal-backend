require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Razorpay = require("razorpay");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cartRoutes = require("./routes/cartRoutes");

const Order = require("./models/Order");
const sendBillEmail = require("./mail");

const app = express();

app.set("trust proxy", 1);

// Middleware
app.use(cors({
  origin: ["https://dregal-frontend.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads Folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Razorpay
const razorpay = new Razorpay({
  key_id:"rzp_test_SYDb9gIxkE4TDc",
  key_secret: "4EK21TaLTP83LJzjb6ViIN6k",
});

// Create Razorpay Order
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating order");
  }
});

// Place Order
app.post("/place-order", async (req, res) => {
  try {
    const orderData = req.body;

    const newOrder = new Order({
      customer: {
        _id: orderData.customer._id,
        name: orderData.customer.name,
        email: orderData.customer.email,
      },

      items: orderData.items,

      total: orderData.total,

      status: "Completed",
    });

    await newOrder.save();

    // Send GST Invoice Mail
    await sendBillEmail(newOrder);

    res.json({
      message: "Order placed successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error placing order",
    });
  }
});

// User Orders API
app.get("/api/orders/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await Order.find({
      "customer._id": userId,
    });

    res.json(orders);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error fetching orders",
    });
  }
});

// Cache Control
app.use((req, res, next) => {
  res.set("cache-control", "no-store");
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("Server Running");
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("database Connected");
  })
  .catch((err) => {
    console.log("MongoDB Error:", err);
  });

// Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});