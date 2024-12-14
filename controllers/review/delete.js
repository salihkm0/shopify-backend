import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const JUDGEME_API_URL = process.env.JUDGEME_API_URL;
const API_KEY = process.env.API_KEY;
const SHOP_DOMAIN = process.env.SHOP_DOMAIN;


export const deleteReview = async (req, res) => {
    const { id } = req.params;
  
    if (!review_id) {
      return res.status(400).json({ error: "Review ID is required" });
    }
  
    try {
      const response = await axios.delete(
        `${JUDGEME_API_URL}/reviews/${id}`,
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
  
      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error.message);
      res.status(500).json({ error: "Failed to delete review" });
    }
  };
  