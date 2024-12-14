import Customer from "../../models/userModel.js";

// Create a new customer
export const createCustomer = async (req, res) => {
  const { user_email, cartId, checkoutUrl, phone } = req.body;

  console.log("body : ", req.body);

  try {
    const existingCustomer = await Customer.findOne({ user_email });
    if (existingCustomer) {
      return res.status(400).json({ message: "Customer already exists." });
    }

    const newCustomer = new Customer({
      user_email,
      cartId,
      checkoutUrl,
      phone,
    });

    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
