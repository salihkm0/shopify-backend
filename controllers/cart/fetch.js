import Cart from "../../models/cartModel.js";

/**
 * Fetch a cart by user_email
 */
export const fetchCart = async (req, res) => {
  const { userEmail } = req.params; // Assuming user_email is passed as a URL parameter
  try {
    const cart = await Cart.findOne({ user_email: userEmail });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    return res.status(200).json({ message: "Cart fetched successfully", cart });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error fetching cart: ${error.message}` });
  }
};
