import express from "express";
import model from "../db/Signup.js";
import bcrypt from "bcrypt";

const router = express.Router();
import pkg from "jsonwebtoken";

const { jwt } = pkg;

const middleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log("Token received:", token);

    const verifytoken = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Verified token:", verifytoken);

    const user = await model.findOne({
      _id: verifytoken._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error("User not found");
    }

    req.token = token;
    req.user = user;
    req.userId = user._id;

    next();
  } catch (err) {
    res.status(401).send("Unauthorized: No token sent");
    console.error(err);
  }
};

router.get("/about", middleware, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

router.post("/signup", async (req, res) => {
  const { name, email, mobile, password } = req.body; //name and email should be same as used in schema
  if (!name || !email || !mobile || !password) {
    return res.status(422).json({ message: "fill data completely" });
  }
  try {
    const { name, email, mobile, password } = req.body;
    const user = new model({ name, email, mobile, password });
    await user.save();
    res.status(201).send("Signup successful!");
  } catch (error) {
    res.status(500).send("Signup failed. Please try again.");
  }
  //-------with promises-----------
  //   model
  //     .findOne({ email: email })
  //     .then((userexist) => {
  //       if (userexist) {
  //         return res.send("user already exist");
  //       }
  //       const doc = new model({
  //         name,
  //         mobile,
  //         email,
  //         password,
  //       });

  //       doc
  //         .save()
  //         .then(() => {
  //           console.log("successfully registered");
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //-------with async await--------------
  // try {
  //   const data = await model.findOne({ email: email });
  //   if (data) {
  //     res.status(201).json({ message: "user already exist" });
  //   }

  //   const newUser = new model({ name, email, mobile, password });

  //   const savedData = await newUser.save();
  //   if (savedData) {
  //     res.status(200).json({ message: "data saved sucessfully" });
  //   } else {
  //     res.status(422).json({ message: "data not saved" });
  //   }
  //   // console.log({ name, mobile }); //headers contetn type set to applciation/json to get data
  // } catch (err) {
  //   res.sendStatus(500).json({ message: "err" });
  // }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });
  const data = await model.findOne({ email: email });
  console.log(data);
  console.log(data.name);
  const isMatch = await bcrypt.compare(password, data.password);
  if (isMatch) {
    const token = await data.generateAuthToken();
    console.log(token + "from isMatch");

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 25800),
      httpOnly: true,
    });

    res.status(200).json({ message: "Login successful" });
  } else {
    console.log("invalid Creadentiasl");
    res.status(401).json({ message: "Invalid credientials" });
  }

  // if (!email || !password) {
  //   res.status(422).json({ message: "Fill in all required fields" });
  // }
  // try {
  //   const data = await model.findOne({ email: email });
  //   if (!data) {
  //     res.status(404).json({ message: "User not found" });
  //   }
  //   const isMatch = await bcrypt.compare(password, data.password);

  // } catch (err) {
  //   res.status(500).json({ message: "Internal server error" });
  // }
});

export default router;
