import axios from "axios"
import dotenv from "dotenv";

dotenv.config();

const SHOPIFY_STORE_NAME = process.env.SHOP_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY;
const ADMIN_ACCESS_TOKEN = process.env.ADMIN_ACCESS_TOKEN;
const STOREFRONT_API_URL = `https://${SHOPIFY_STORE_NAME}.myshopify.com/api/2024-01/graphql.json`;
const ADMIN_API_URL = `https://${SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2024-01/graphql.json`;

export const cancelOrder = async (req, res) => {
  const { orderId } = req.body;
  const mutation = `
      mutation CancelOrder($id: ID!) {
        orderCancel(id: $id) {
          order {
            id
            statusUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

  try {
    const response = await axios.post(
      ADMIN_API_URL,
      { query: mutation, variables: { id: orderId } },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": ADMIN_ACCESS_TOKEN,
        },
      }
    );

    const canceledOrder = response.data.data.orderCancel.order;
    res.json({ success: true, canceledOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const returnOrder = async (orderId, refundLineItems) => {
  const mutation = `
      mutation CreateRefund($input: RefundInput!) {
        refundCreate(input: $input) {
          refund {
            id
            order {
              id
              name
              financialStatus
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

  const refundInput = {
    orderId,
    refundLineItems,
    notify: true,
    restock: true,
  };

  try {
    const response = await axios.post(
      ADMIN_API_URL,
      { query: mutation, variables: { input: refundInput } },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": ADMIN_ACCESS_TOKEN,
        },
      }
    );

    const refund = response.data.data.refundCreate;
    if (refund.userErrors.length) {
      return { success: false, errors: refund.userErrors };
    }
    return { success: true, refund: refund.refund };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateShippingAddress = async (orderId, newAddress) => {
  const mutation = `
    mutation UpdateShippingAddress($id: ID!, $address: MailingAddressInput!) {
      orderShippingAddressUpdate(orderId: $id, shippingAddress: $address) {
        order {
          id
          name
          shippingAddress {
            address1
            address2
            city
            province
            country
            zip
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      ADMIN_API_URL,
      {
        query: mutation,
        variables: {
          id: orderId,
          address: newAddress,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": ADMIN_ACCESS_TOKEN,
        },
      }
    );

    const data = response.data.data.orderShippingAddressUpdate;

    if (data.userErrors.length > 0) {
      return { success: false, errors: data.userErrors };
    }

    return { success: true, order: data.order };
  } catch (error) {
    console.error(
      "Error updating shipping address:",
      error.response?.data || error.message
    );
    throw new Error("Failed to update shipping address");
  }
};
