require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user.js");
const productRoutes = require("./routes/product.js");
const orderRoutes = require("./routes/order.js");

const app = express();

const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PRODUCTION = NODE_ENV === "production";

// CORS
// - Dev: allow all if CORS_ORIGINS is not set (DX-friendly)
// - Prod: fail-closed if CORS_ORIGINS is not set (public-safe)
// Env format: CORS_ORIGINS=http://localhost:3000,https://shopjsv2-frontend.vercel.app
const CORS_ORIGINS = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests without Origin header are not CORS (e.g. curl, server-to-server)
      if (!origin) return callback(null, true);

      if (!IS_PRODUCTION && CORS_ORIGINS.length === 0) {
        return callback(null, true);
      }

      if (CORS_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "ShopJS v2 - Backend API",
    version: "1.0.0",
    status: "Running",
    environment: NODE_ENV,
    endpoints: {
      products: "/products",
      auth: "/user/signup, /user/login",
      orders: "/orders",
      ...(IS_PRODUCTION ? {} : { init: "POST /create-db" }),
    },
    database: process.env.MONGODB_URI ? "Connected" : "Local",
  });
});

app.use(userRoutes);
app.use(productRoutes);
app.use(orderRoutes);

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/shopjsv2";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    console.log(`Database: ${MONGODB_URI.split("/").pop()?.split("?")[0]}`);
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  });

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route does not exist" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Local URL: http://localhost:${PORT}`);
});
