import mongoose from 'mongoose';

// Define the CartLine schema
const CartLineSchema = new mongoose.Schema({
  merchandise: {
    productVariantId: { type: String, required: true },
    title: { type: String, required: true },
  },
  quantity: { type: Number, required: true, default: 1 }
});

// Define the main Cart schema
const CartSchema = new mongoose.Schema(
  {
    // cartId: { type: String, required: true, unique: true }, 
    user_email: { type: String, required: true },
    lines: [CartLineSchema],
    checkoutUrl: { type: String }, 
  },
  { timestamps: true }
);

// Create the Cart model
const Cart = mongoose.model('Cart', CartSchema);

export default Cart;
