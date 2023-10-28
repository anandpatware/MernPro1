import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

mongoose
  .connect("mongodb://localhost:27017/mernpro")
  .then(() => {
    console.log("connection successful");
  })
  .catch(() => {
    console.log("eerrrrrrrrrrrr");
  });
