import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute";

/**
 * Entry point for the e-commerce backend application.
 */

const app = express();
const PORT = 3001;

mongoose
  .connect("mongodb://localhost:27017/ecommerce")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Could not connect to MongoDB", err));

// Middleware
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("E-commerce backend is running!");
});

app.use('/user', userRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
