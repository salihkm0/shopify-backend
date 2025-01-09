import Cart from "../../models/cartModel.js";
import { cartValidationSchema } from "../../utils/cartValidator.js";

/**
 * Add item to cart
 */
export const addToCart = async (req, res) => {
  const { cartId, user_email, merchandise, quantity } = req.body;

  // Validate input using Joi
  const { error } = cartValidationSchema.validate({
    cartId,
    user_email,
    lines: [{ merchandise, quantity }],
  });

  if (error) {
    return res
      .status(400)
      .json({ message: `Validation error: ${error.message}` });
  }

  try {
    // Check if the cart exists
    let cart = await Cart.findOne({ cartId });

    if (!cart) {
      // If no cart exists, create a new one
      cart = new Cart({
        cartId,
        user_email,
        lines: [{ merchandise, quantity }],
      });
    } else {
      // If cart exists, check if the item already exists
      const existingLine = cart.lines.find(
        (line) =>
          line.merchandise.productVariantId === merchandise.productVariantId
      );

      if (existingLine) {
        // If item exists, update the quantity
        existingLine.quantity += quantity;
      } else {
        // If item does not exist, add it to the cart
        cart.lines.push({ merchandise, quantity });
      }
    }

    // Save the updated cart
    const updatedCart = await cart.save();

    return res
      .status(200)
      .json({ message: "Item added to cart successfully", cart: updatedCart });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error adding item to cart: ${error.message}` });
  }
};

/**
 * Remove a cart by cartId
 */
export const removeCart = async (req, res) => {
  const { userEmail } = req.params; // Assuming cartId is passed as a URL parameter
  try {
    const deletedCart = await Cart.findOneAndDelete({ user_email: userEmail });
    if (!deletedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    return res
      .status(200)
      .json({ message: "Cart removed successfully", cart: deletedCart });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error removing cart: ${error.message}` });
  }
};

/**
 * Update the quantity of a specific item in the cart
 */
export const updateCartItemQuantity = async (req, res) => {
  const { userEmail } = req.params; // Assuming cartId is passed as a URL parameter
  const { productVariantId, quantity } = req.body; // Assuming these are passed in the request body

  try {
    const cart = await Cart.findOne({ user_email: userEmail });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.productVariantId === productVariantId
    );
    if (!lineItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (quantity <= 0) {
      // Remove the item if quantity is zero or less
      cart.lines = cart.lines.filter(
        (line) => line.merchandise.productVariantId !== productVariantId
      );
    } else {
      // Update the quantity
      lineItem.quantity = quantity;
    }

    const updatedCart = await cart.save();
    return res
      .status(200)
      .json({ message: "Cart updated successfully", cart: updatedCart });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error updating item quantity: ${error.message}` });
  }
};
