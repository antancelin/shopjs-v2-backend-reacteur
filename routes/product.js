const express = require("express");
const Product = require("../models/Product.js");
const data = require("../assets/products.json");
const router = express.Router();

router.post("/create-db", async (req, res) => {
  try {
    // Public-safe: never expose destructive seed route in production
    if (process.env.NODE_ENV === "production") {
      return res.status(404).json({ message: "This route does not exist" });
    }

    await Product.deleteMany();
    await Product.insertMany(data);
    res.status(201).json({ message: "DB created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({
      title: new RegExp(req.query.search || ""),
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
