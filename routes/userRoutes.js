import express from "express";
import { createCustomer } from "../controllers/customer/create.js";
import { getAllCustomers, getCartIdByEmail, getCustomerById } from "../controllers/customer/fetch.js";
import { updateCustomer } from "../controllers/customer/update.js";
import { deleteCustomer } from "../controllers/customer/delete.js";

const userRouter = express.Router();

userRouter
  .route("/")
  .post(createCustomer)
  .get(getAllCustomers);
userRouter
  .route("/:email")
  .get(getCustomerById)
  .put(updateCustomer)
  .delete(deleteCustomer);

  // Get cart ID by email
  userRouter.get("/cart/:email", getCartIdByEmail);

export default userRouter;
