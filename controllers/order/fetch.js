import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const SHOPIFY_STORE_NAME = process.env.SHOP_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY;
const ADMIN_ACCESS_TOKEN = process.env.ADMIN_ACCESS_TOKEN;
const STOREFRONT_API_URL = `https://${SHOPIFY_STORE_NAME}/api/2024-01/graphql.json`;
const ADMIN_API_URL = `https://${SHOPIFY_STORE_NAME}/admin/api/2024-01/graphql.json`;

export const fetchOrder = async (req, res) => {
  const { customerAccessToken } = req.body;

  const query = `
      query GetCustomerOrders($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          orders(first: 10) {
            edges {
              node {
                id
                name
                financialStatus
                fulfillmentStatus
                lineItems(first: 10) {
                  edges {
                    node {
                      title
                      quantity
                    }
                  }
                }
                totalPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    `;

  try {
    const response = await axios.post(
      STOREFRONT_API_URL,
      { query, variables: { customerAccessToken } },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN,
        },
      }
    );

    const orders = response.data.data.customer.orders.edges.map(
      (order) => order.node
    );
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// export const fetchOrderStatus = async (orderId) => {
//   const query = `
//       query GetOrderStatus($id: ID!) {
//         order(id: $id) {
//           id
//           name
//           financialStatus
//           fulfillmentStatus
//           createdAt
//           totalPriceSet {
//             shopMoney {
//               amount
//               currencyCode
//             }
//           }
//           lineItems(first: 10) {
//             edges {
//               node {
//                 title
//                 quantity
//                 fulfillmentStatus
//               }
//             }
//           }
//         }
//       }
//     `;

//   try {
//     const response = await axios.post(
//       ADMIN_API_URL,
//       {
//         query,
//         variables: { id: orderId },
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "X-Shopify-Access-Token": ADMIN_ACCESS_TOKEN,
//         },
//       }
//     );

//     console.log("Response : ",JSON.stringify(response.data));

//     return response.data.data.order;
//   } catch (error) {
//     console.error(
//       "Error fetching order status:",
//       error.response?.data || error.message
//     );
//     throw new Error("Failed to fetch order status");
//   }
// };


export const fetchOrderStatus = async (orderId) => {
    const query = `
        query GetOrderStatus($id: ID!) {
          order(id: $id) {
            id
            name
            
            createdAt
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  
                }
              }
            }
          }
        }
      `;
  
    try {
      const response = await axios.post(
        ADMIN_API_URL,
        {
          query,
          variables: { id: orderId },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": ADMIN_ACCESS_TOKEN,
          },
        }
      );
  
      console.log("Response : ", JSON.stringify(response.data));
      return response.data.data.order;
    } catch (error) {
      console.error(
        "Error fetching order status:",
        error.response?.data || error.message
      );
      throw new Error("Failed to fetch order status");
    }
  };
  