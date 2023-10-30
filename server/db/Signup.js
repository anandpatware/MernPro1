import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: Number,
  password: { type: String, required: true },
  tokens: [{ token: { type: String, required: true } }],
});
schema.pre("save", async function (next) {
  //middleware which runs before save fn
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

schema.methods.generateAuthToken = async function () {
  try {
    let tokenn = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: tokenn });

    await this.save();
    return tokenn;
  } catch (err) {
    console.log(err);
  }
};
const model = new mongoose.model("signup", schema); //this is my collection based on above schema                      now we can export this collection to add document in it like below

// const doc1 = new model({
//   //sample doc created
//   name: "anand",
//   email: "anpavnr@kk.cmo",
//   mobile: 728569886,
//   password: process.env.PASS,
// });
// doc1.save();

export default model;
// mongodb://lybl-stage:*****@18.190.49.204:27017/booking?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false
