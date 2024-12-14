import Customer from "../../models/userModel.js";

// Update a customer
export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
