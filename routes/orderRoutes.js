import express from "express";
import { fetchOrder, fetchOrderStatus } from "../controllers/order/fetch.js";
import {
  cancelOrder,
  returnOrder,
  updateShippingAddress,
} from "../controllers/order/update.js";

const orderRouter = express.Router();

orderRouter.post("/", fetchOrder);

orderRouter.get("/:orderId/status", async (req, res) => {
  const { orderId } = req.params;

  try {
    const orderStatus = await fetchOrderStatus(orderId);
    res.json({ success: true, order: orderStatus });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to cancel an order
orderRouter.post("/cancel", async (req, res) => {
  try {
    await cancelOrder(req, res);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to return an order
orderRouter.post("/return", async (req, res) => {
  const { orderId, refundLineItems } = req.body;

  try {
    const result = await returnOrder(orderId, refundLineItems);

    if (!result.success) {
      res.status(400).json({ success: false, errors: result.errors });
    } else {
      res.json({ success: true, refund: result.refund });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

orderRouter.put("/:orderId/shipping", async (req, res) => {
  const { orderId } = req.params;
  const newAddress = req.body;

  try {
    const result = await updateShippingAddress(orderId, newAddress);

    if (!result.success) {
      res.status(400).json({ success: false, errors: result.errors });
    } else {
      res.json({ success: true, order: result.order });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default orderRouter;
