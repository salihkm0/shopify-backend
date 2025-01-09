import Cart from "../../models/cartModel";

/**
 * Delete a cart by user_email
 */
export const deleteCart = async (req, res) => {
    const { user_email } = req.params; // Assuming user_email is passed as a URL parameter
    try {
      const deletedCart = await Cart.findOneAndDelete({ user_email });
      if (!deletedCart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      return res.status(200).json({ message: "Cart deleted successfully", cart: deletedCart });
    } catch (error) {
      return res.status(500).json({ message: `Error deleting cart: ${error.message}` });
    }
  };