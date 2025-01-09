import { shopifyClient } from "../../config/shopifyClient.js";
import Cart from "../../models/cartModel.js";
import { cartValidationSchema } from "../../utils/cartValidator.js";

/**
 * Create a new cart
 */
export const createCart = async (req, res) => {
  const cartData = req.body;

  // Validate incoming cart data using Joi
  const { error } = cartValidationSchema.validate(cartData);
  if (error) {
    return res
      .status(400)
      .json({ message: `Validation error: ${error.message}` });
  }

  try {
    const cart = new Cart(cartData);
    const savedCart = await cart.save();
    return res
      .status(201)
      .json({ message: "Cart created successfully", cart: savedCart });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error creating cart: ${error.message}` });
  }
};

export const createShopifyCartWithVariants = async (req, res) => {
  const { user, accessToken } = req.body;

  if (!user || !user.email || !accessToken) {
    return res.status(400).json({ error: "User details or access token missing." });
  }

  try {
    // Fetch cart data from the database using the user's email
    const cartData = await Cart.findOne({ user_email: user.email });

    if (!cartData || !cartData.lines || cartData.lines.length === 0) {
      return res.status(404).json({ error: "No cart data found for this user." });
    }

    const query = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const buyerIdentity = {
      email: user.email,
      phone: user.phone || null,
      countryCode: user.countryCode || "IN",
    };

    const variables = {
      input: {
        lines: cartData.lines.map((line) => ({
          merchandiseId: line.merchandise.productVariantId,
          quantity: line.quantity,
          attributes: [
            { key: "Lens Color", value: line.lensColor || "Default Lens" },
            { key: "Frame Color", value: line.frameColor || "Default Frame" },
            { key: "Frame Type", value: line.frameType || "Default Type" },
          ],
        })),
        attributes: [
          {
            key: "cart_attribute",
            value: "This is a cart attribute",
          },
        ],
        buyerIdentity: buyerIdentity,
      },
    };

    const response = await shopifyClient.post("", { query, variables });

    if (response.data.errors) {
      return res
        .status(400)
        .json({ error: `GraphQL Error: ${response.data.errors[0].message}` });
    }

    const { cart, userErrors } = response.data.data.cartCreate;
    if (userErrors && userErrors.length > 0) {
      return res
        .status(400)
        .json({ error: `Shopify Error: ${userErrors[0].message}` });
    }

    if (!cart) {
      return res.status(400).json({ error: "Failed to create a cart in Shopify." });
    }

    console.log("Shopify Cart created successfully with variants:", cart);

    res.status(200).json({
      message: "Cart created successfully",
      shopifyCart: cart,
    });
  } catch (error) {
    console.error("Error creating cart:", error.message || error);
    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};

