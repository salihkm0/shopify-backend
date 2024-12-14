import mongoose from "mongoose";

const customerModelSchema = new mongoose.Schema(
  {
    user_email: { type : String ,required: true,unique: true},
    cartId: { type: String },
    checkoutUrl: { type: String },
    phone: { type: Number},
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Customer", customerModelSchema);
