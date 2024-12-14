import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const JUDGEME_API_URL = process.env.JUDGEME_API_URL;
const API_KEY = process.env.API_KEY;
const SHOP_DOMAIN = process.env.SHOP_DOMAIN;

export const updateReview = async (req, res) => {
    const { id } = req.params;
    const {  reviewer_name, reviewer_email, rating, review_body } = req.body;
  
    if (!id || !reviewer_name || !reviewer_email || !rating || !review_body) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    // Prepare the updated review data
    const payload = {
      reviewer_name,
      reviewer_email,
      rating,
      review_body,
    };
  
    try {
      const response = await axios.put(
        `${JUDGEME_API_URL}/reviews/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
          params: {
            api_token: API_KEY,
            shop_domain: SHOP_DOMAIN,
          },
        }
      );
  
      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error updating review:", error.message);
      res.status(500).json({ error: "Failed to update review" });
    }
  };
  