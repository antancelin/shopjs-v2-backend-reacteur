const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated.js");
const Order = require("../models/Order.js");
const isAdmin = require("../middlewares/isAdmin.js");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/orders", isAuthenticated, async (req, res) => {
  try {
    const { products, address, price } = req.body;
    await Order.create({
      owner: req.user._id,
      products: products,
      address: address,
      price: price,
      delivered: false,
    });
    res.status(201).json({ message: "Order created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put(
  "/orders/mark-delivered/:id",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    console.log("route mark");

    try {
      await Order.findByIdAndUpdate(req.params.id, { delivered: true });
      res.json({ message: "Updated" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get("/orders", isAuthenticated, isAdmin, async (req, res) => {
  try {
    console.log("orders");

    // Public-safe: never leak sensitive user fields (token/hash/salt/email)
    // Only expose what's needed for admin UI
    const orders = await Order.find().populate({
      path: "owner",
      select: "_id username admin",
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
