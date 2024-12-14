addReview;

import express from "express";
import { addReview } from "../controllers/review/create.js";
import {
  fetchReviews,
  fetchReviewsByProduct,
  fetchReviewsByUser,
} from "../controllers/review/fetch.js";
import { updateReview } from "../controllers/review/update.js";
import { deleteReview } from "../controllers/review/delete.js";
const reviewRouter = express.Router();

reviewRouter.post("/", addReview);
reviewRouter.get("/", fetchReviews);
reviewRouter.put("/:id", updateReview);
reviewRouter.delete("/:id", deleteReview);
reviewRouter.get("/product/:product_handle", fetchReviewsByProduct);
reviewRouter.get("/user/:reviewer_email", fetchReviewsByUser);

export default reviewRouter;
