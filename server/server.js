import express from "express";
import dotenv from "dotenv";
import "./db/dbconn.js";
import router from "./router/authmidleware.js";
import cors from "cors";

const app = express();
// After initializing your Express app
app.use(cors());

dotenv.config({ path: "./config.env" }); // write and get access everywhere

app.use(express.json()); //this is will convert json to pbject and help us to get that data in app
app.use(router); //this will use api of router if it not there it will use of below one

app.get("/", (req, res) => {
  res.send("this is orioror");
});

app.listen(5000, () => {
  console.log(`server running on ${process.env.PORT}`);
});
