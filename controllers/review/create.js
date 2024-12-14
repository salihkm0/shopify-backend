// import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();

// const JUDGEME_API_URL = process.env.JUDGEME_API_URL;
// const API_KEY = process.env.API_KEY;

// // Log environment variables for debugging
// console.log("Judge.me API URL:", JUDGEME_API_URL);
// console.log("API Key:", API_KEY);

// export const addReview = async (req, res) => {
//   console.log("Request Body:", req.body);

//   const { reviewer_name, reviewer_email, rating, review_body, product_handle } = req.body;

//   // Check for missing environment variables
//   if (!JUDGEME_API_URL || !API_KEY) {
//     return res.status(500).json({ error: "Missing API URL or API Key" });
//   }

//   // Validate the request body
//   if (!reviewer_name || !reviewer_email || !rating || !review_body || !product_handle) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reviewer_email)) {
//     return res.status(400).json({ error: "Invalid email format" });
//   }

//   if (typeof rating !== "number" || rating < 1 || rating > 5) {
//     return res.status(400).json({ error: "Rating must be a number between 1 and 5" });
//   }

//   try {
//     const url = `${JUDGEME_API_URL}/reviews`;
//     console.log("Request URL:", url); // Log the final URL for debugging

//     const response = await axios.post(
//       url,
//       {
//         reviewer_name,
//         reviewer_email,
//         rating,
//         review_body,
//         product_handle,
//       },
//       {
//         headers: { Authorization: `Bearer ${API_KEY}` },
//       }
//     );

//     console.log("API Response:", response.data); // Log the response from Judge.me API
//     res.status(201).json(response.data);
//   } catch (error) {
//     // Enhanced error handling
//     if (error.response) {
//       console.error("Error Response Data:", error.response.data);
//       console.error("Error Response Status:", error.response.status);
//       console.error("Error Response Headers:", error.response.headers);
//       res.status(error.response.status).json({ error: error.response.data });
//     } else if (error.request) {
//       console.error("No Response Received:", error.request);
//       res.status(500).json({ error: "No response received from Judge.me API" });
//     } else {
//       console.error("Error Setting Up Request:", error.message);
//       res.status(500).json({ error: "Error setting up request" });
//     }
//   }
// };

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
