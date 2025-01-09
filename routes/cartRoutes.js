import express from "express";
import { createCart, createShopifyCartWithVariants } from "../controllers/cart/create.js";
import { addToCart, removeCart, updateCartItemQuantity } from "../controllers/cart/update.js";
import { fetchCart } from "../controllers/cart/fetch.js";

const cartRouter = express.Router();

  // Get cart ID by email
  cartRouter.get("/:userEmail", fetchCart);
  cartRouter.post("/", createCart);
  cartRouter.post("/add", addToCart);
  cartRouter.post("/create", createShopifyCartWithVariants);
  cartRouter.put("/update/:userEmail", updateCartItemQuantity);
  cartRouter.put("/remove/:userEmail", removeCart);
  

export default cartRouter;