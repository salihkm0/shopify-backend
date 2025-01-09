import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.SHOPIFY_API_URL;
const API_TOKEN = process.env.SHOPIFY_API_TOKEN;

export const shopifyClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": API_TOKEN,
  },
});
