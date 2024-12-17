import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const JUDGEME_API_URL = process.env.JUDGEME_API_URL;
const API_KEY = process.env.API_KEY;
const SHOP_DOMAIN = process.env.SHOP_DOMAIN;

export const addReview = async (req, res) => {
  const {
    reviewer_name,
    reviewer_email,
    rating,
    review_body,
    product_handle,
    title,
  } = req.body;

  if (
    !reviewer_name ||
    !reviewer_email ||
    !rating ||
    !review_body ||
    !product_handle ||
    !title
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Prepare the review data
  const payload = {
    shop_domain: SHOP_DOMAIN,
    platform: "shopify",
    email: reviewer_email,
    name: reviewer_name,
    rating,
    title: title,
    body: review_body,
    id: product_handle,
    // cf_answers: [
    //   { cf_question_id: 1, value: "Yellow" },
    //   { cf_question_id: 2, value: "Big" },
    //   { cf_question_id: 3, value: "4/5" },
    //   { cf_question_id: 4, value: "Free text answer" }
    // ],
    // picture_urls: ["https://pub-images.judge.me/judgeme/funny/big-pr.jpg"],
    // ip_addr: "123.123.123.123"  // Optional, only include if available
  };

  try {
    const response = await axios.post(`${JUDGEME_API_URL}/reviews`, payload, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      params: {
        api_token: API_KEY,
        shop_domain: SHOP_DOMAIN,
      },
    });
    res.status(201).json(response.data);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Failed to add review" });
  }
};
