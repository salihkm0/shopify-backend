import Customer from "../../models/userModel.js";

// Delete a customer
export const deleteCustomer = async (req, res) => {
  const { email } = req.params;

  try {
    const deletedCustomer = await Customer.findOneAndDelete({user_email : email});
    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    res.status(200).json({ message: "Customer deleted successfully." });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
