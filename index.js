import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./config/dbConnection.js";
import userRouter from "./routes/userRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";


const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const port = process.env.PORT || 3000;

app.use("/api/customer", userRouter);
app.use("/api/reviews", reviewRouter);


dbConnection()
  .then(() => {
    app.listen(port, () => {
      console.log(`✓ App is running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error("✘ Failed to connect to the database", err);
  });
