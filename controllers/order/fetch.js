import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const SHOPIFY_STORE_NAME = process.env.SHOP_DOMAIN;
// const STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY
const STOREFRONT_ACCESS_TOKEN = "aae77a75514b280e61a74cc7ee993635";
const ADMIN_ACCESS_TOKEN = process.env.ADMIN_ACCESS_TOKEN;
const STOREFRONT_API_URL = `https://${SHOPIFY_STORE_NAME}/api/2024-01/graphql.json`;
const ADMIN_API_URL = `https://${SHOPIFY_STORE_NAME}/admin/api/2024-01/graphql.json`;

export const fetchOrder = async (req, res) => {
//   const { customerAccessToken } = req.body;
  const { customerAccessToken } = req.body;
  console.log("Fetching order : ", customerAccessToken)
  const query = `
      query GetCustomerOrders($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          orders(first: 100) {
            edges {
              node {
                id
                name
                lineItems(first: 100) {
                  edges {
                    node {
                      title
                      quantity
                      variant {
                        image {
                          src
                        }
                      }
                    }
                  }
                }
                currentTotalPrice {
                  amount
                  currencyCode
                }
                fulfillmentStatus
                shippingAddress {
                  address1
                  address2
                  city
                  province
                  country
                  zip
                  firstName
                  lastName
                  phone
                }
                billingAddress {
                  address1
                  address2
                  city
                  province
                  country
                  zip
                  firstName
                  lastName
                  phone
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

    const orders = response.data.data.customer.orders.edges.map((order) => {
      const node = order.node;

      return {
        id: node.id,
        name: node.name,
        totalPrice: node.currentTotalPrice,
        fulfillmentStatus: node.fulfillmentStatus,
        shippingAddress: node.shippingAddress,
        items: node.lineItems.edges.map((item) => ({
          title: item.node.title,
          quantity: item.node.quantity,
          image: item.node.variant?.image?.src || null,
        })),
      };
    });

    res.json({ success: true, orders });
  } catch (error) {
    console.error(
      "Error Details:",
      JSON.stringify(error.response?.data, null, 2)
    );
    res.status(500).json({
      success: false,
      error: error.response?.data?.errors[0]?.message || "Unknown error",
    });
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

// export const fetchOrder = async (req, res) => {
//     const { customerAccessToken } = req.body;

//     const query = `
//       query GetCustomerOrders($customerAccessToken: String!) {
//         customer(customerAccessToken: $customerAccessToken) {
//           orders(first: 100) {
//             edges {
//               node {
//                 id
//                 name
//                 processedAt
//                 subtotalPrice {
//                   amount
//                   currencyCode
//                 }
//                 currentTotalTax {
//                   amount
//                   currencyCode
//                 }
//                 totalShippingPrice {
//                   amount
//                   currencyCode
//                 }
//                 shippingAddress {
//                   address1
//                   address2
//                   city
//                   province
//                   country
//                   zip
//                 }
//                 lineItems(first: 100) {
//                   edges {
//                     node {
//                       title
//                       quantity
//                       customAttributes {
//                         key
//                         value
//                       }
//                     }
//                   }
//                 }
//                 discountApplications(first: 10) {
//                   edges {
//                     node {
//                       value {
//                         ... on DiscountCodeApplication {
//                           code
//                         }
//                         ... on AutomaticDiscountApplication {
//                           title
//                         }
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     `;

//     try {
//       const response = await axios.post(
//         STOREFRONT_API_URL,
//         { query, variables: { customerAccessToken } },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN,
//           },
//         }
//       );

//       console.log('res' , JSON.string(response))

//       const orders = response.data.data.customer.orders.edges.map(
//         (order) => order.node
//       );
//       res.json({ success: true, orders });
//     } catch (error) {
//       console.error("Error Details:", JSON.stringify(error.response?.data, null, 2));
//       res.status(500).json({
//         success: false,
//         error: error.response?.data?.errors[0]?.message || "Unknown error",
//       });
//     }
//   };

export const fetchOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const response = await axios.get(
      `${ADMIN_API_URL}/orders/${orderId}.json`,
      {
        headers: {
          "X-Shopify-Access-Token": ADMIN_ACCESS_TOKEN,
        },
      }
    );
    console.log("Order Details:", response.data.order);
  } catch (error) {
    console.error(
      "Error fetching order:",
      error.response ? error.response.data : error.message
    );
  }
};

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

  // Convert the raw orderId to a global ID
  const globalOrderId = encodeShopifyId("Order", orderId);

  try {
    const response = await axios.post(
      ADMIN_API_URL,
      {
        query,
        variables: { id: globalOrderId },
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
