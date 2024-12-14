import Customer from "../../models/userModel.js";

// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
// Get a single customer by ID
export const getCustomerById = async (req, res) => {
  const { email } = req.params;
  try {
    const customer = await Customer.findOne({user_email :email});
    if (!customer) {
      return res.status(404).json({ message: "Customer not found." ,success: false});
    }

    res.status(200).json({customer : customer , success: true});
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Internal server error.",success: false });
  }
};

// Get CartId by email
export const getCartIdByEmail = async (req, res) => {
    const { email } = req.params;

    console.log("email", email);    
  
    try {
      const customer = await Customer.findOne({ user_email: email });
      console.log("customer : ", customer);
      if (!customer || !customer.cartId || !customer.checkoutUrl) {
        return res.status(404).json({ message: "Cart ID ,Checkout Url not found for this email.",success: false });
      }
  
      res.status(200).json({cartId: customer.cartId ,checkoutUrl : customer.checkoutUrl ,success: true});
    } catch (error) {
      console.error("Error fetching cart ID:", error);
      res.status(500).json({ message: "Internal server error." ,success: false});
    }
  };

//   customer :  {
//     _id: new ObjectId('675bf49c19090857dd7344d2'),
//     user_email: 'salihkm000@gmail.com',
//     cartId: 'gid://shopify/Cart/Z2NwLWFzaWEtc291dGhlYXN0MTowMUpFWkg4OTBGUzhTRzg5SzlXQ1o3Tk42NA?key=302ce03a55e0b427c06ae7b3c280b775',
//     checkoutUrl: 'https://4bz4tg-qg.myshopify.com/cart/c/Z2NwLWFzaWEtc291dGhlYXN0MTowMUpFWkg4OTBGUzhTRzg5SzlXQ1o3Tk42NA?key=3oeUfAsoNLgvioYLR8PCZLYIV5omh9zfdL0ZjAwKdShugn_Se4wToXfkfa1D7TOlkbVCkzEiV6-HMHtZshqunUkTGvhM6a5yrMZphbUcMMU0NZGl-YmyuQ-nwuS1lNJFVkf-PlVgjkdV9ezxHxNkOCu0nAkQ1ey0UIAX-_IXktLAnsnevB_wH2Q6NTnqRzjH',
//     createdAt: 2024-12-13T08:47:24.497Z,
//     updatedAt: 2024-12-13T08:47:24.497Z,
//     __v: 0
//   }