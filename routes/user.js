const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../model/user");
const generateToken = require("../helpers/generateToken");
const upload = require("../middleware/upload");

//register user
router.post("/register", upload().single("file"), async (req, res) => {
  try {
    const { password } = req.body;
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      ...req.body,
      password: hashPassword,
      image: req.file.filename,
    });

    const savedUser = await newUser.save();
    const { _id, name, email, image } = savedUser.toObject();
    const token = generateToken({ _id, email });
    res.status(200).json({ _id, name, email, token, image });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//login user
router.post("/login", async (req, res) => {
  const { password } = req.body;
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "User not found!" });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Password not match" });
  }

  const { _id, name, email, image } = user;
  const token = generateToken({ _id, email });
  const response = { _id, name, email, token, image };
  res.status(200).json(response);
});

module.exports = router;
