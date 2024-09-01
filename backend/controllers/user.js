const userSchema = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  const data = req.body;

  try {
    const user = await userSchema.findOne({ email: data.email });
    if (!user) {
      const saltNumber = 10;
      let hashedPassword = await bcrypt.hash(data.password, saltNumber);
      data.password = hashedPassword;
      const newuser = new userSchema(data);
      await newuser.save();

      return res
        .status(201)
        .json({ res: newuser, message: "created Succesfully" });
    } else {
      return res.status(401).json({ message: "User Already Present" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const data = req.body;
  try {
    const user = await userSchema.findOne({ email: data.email });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or Password" });
    }
    let comparePassword = await bcrypt.compare(data.password, user.password);

    if (comparePassword) {
      let { password, ...result } = user._doc;
      const token = jwt.sign(
        { id: user._id.toString(), username: user.username },
        process.env.SECRET_KEY,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
      );
      result.token = token;

      return res.status(200).json({ ...result, message: "Login succesfully" });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ message: error.message });
  }
};
