import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const JUDGEME_API_URL = process.env.JUDGEME_API_URL;
const API_KEY = process.env.API_KEY;
const SHOP_DOMAIN = process.env.SHOP_DOMAIN;

export const fetchReviews = async (req, res) => {
  const allReviews = [];
  let currentPage = 1;

  try {
    while (true) {
      const response = await axios.get(`${JUDGEME_API_URL}/reviews`, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
        params: {
          api_token: API_KEY,
          shop_domain: SHOP_DOMAIN,
          page: currentPage,
        },
      });

      const reviews = response.data.reviews || [];
      allReviews.push(...reviews);

      // Break if no more reviews
      if (reviews.length === 0) break;

      currentPage++;
    }

    res.status(200).json({ reviews: allReviews });
  } catch (error) {
    console.error("Error fetching all reviews:", error.message);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};



  
  export const fetchReviewsByProduct = async (req, res) => {
    const { product_handle } = req.params;
  
    if (!product_handle) {
      return res.status(400).json({ error: "Product handle is required" });
    }
  
    try {
      const response = await axios.get(`${JUDGEME_API_URL}/reviews`, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
        params: {
          api_token: API_KEY,
          shop_domain: SHOP_DOMAIN,
          product_handle, // Filter reviews by product_handle
        },
      });
  
      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error fetching reviews by product:", error.message);
      res.status(500).json({ error: "Failed to fetch reviews by product" });
    }
  };
  

  export const fetchReviewsByUser = async (req, res) => {
    const { reviewer_email } = req.query;
  
    if (!reviewer_email) {
      return res.status(400).json({ error: "Reviewer email is required" });
    }
  
    try {
      const response = await axios.get(`${JUDGEME_API_URL}/reviews`, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
        params: {
          api_token: API_KEY,
          shop_domain: SHOP_DOMAIN,
          reviewer_email, // Filter reviews by reviewer_email
        },
      });
  
      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error fetching reviews by user:", error.message);
      res.status(500).json({ error: "Failed to fetch reviews by user" });
    }
  };
  