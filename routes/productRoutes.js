import express from "express";
import { fetchAllProducts } from "../controllers/products/fetch.js";

const productsRouter = express.Router();

productsRouter.get("/", fetchAllProducts);

export default productsRouter;
