import express from "express";
import model from "../db/Signup.js";
import bcrypt from "bcrypt";
const router = express.Router();

const middleware = (req, res, next) => {
  console.log(
    "it will check if person is login or before rendering any route "
  );
  next();
};
router.get("/", (req, res) => {
  res.send("kisrnvkien");
});
router.get("/about", middleware, async (req, res) => {
  //middleware is used to show or do things                                                    vefore  reendering the about page
  const data = await model.find();
  console.log(data);
  res.send(data);
});

router.get("/contact", (req, res) => {
  res.send("this is contac us page");
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
  const data = await model.findOne({ email: email });
  if (data != null) {
    if (password === data.password) {
      alert("login");
    } else {
      alert("wronf psd");
    }
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
  //   if (isMatch) {
  //     const token = await data.generateAuthToken();
  //     res.cookie("jwttoken", token, {
  //       expires: new Date(Date.now() + 100000),
  //       httpOnly: true,
  //     });
  //     console.log(token);
  //     res.status(200).json({ message: "Login successful" });
  //   } else {
  //     res.status(401).json({ message: "Invalid credientials" });
  //   }
  // } catch (err) {
  //   res.status(500).json({ message: "Internal server error" });
  // }
});

export default router;
