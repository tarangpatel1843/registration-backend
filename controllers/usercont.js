const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usermodel = require("../model/usermodel");

const JWT_SECRET = process.env.JWT_SECRET || '30aa21aab4c5bb3002add13bb6b1f1216a62dbba78009fc9d05ea1d07daf18e627afe628c354f7c677c4da0cabf0f35c393a7dc345601579538fca5d4e176dcb';

const register = async (req, res) => {
  try {
    const { name, dob, email, password, role } = req.body;

    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      return res.json({ msg: "Account already exists" });
    }

    const pwdhash = await bcrypt.hash(password, 10);

    const newUser = new usermodel({
      name,
      dob,
      email,
      password: pwdhash,
      role
    });

    await newUser.save();
    res.json({ msg: "Account created successfully" });
  } catch (err) {
    res.json({ msg: "Error in registration", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const user = await usermodel.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.json({ msg: "Error in login", error: err.message });
  }
};

const get = async (req, res) => {
  try {
    const users = await usermodel.find();
    res.json(users);
  } catch (err) {
    res.json({ msg: "Error fetching users", error: err.message });
  }
};

const getByEmail = async (req, res) => {
  try {
    const user = await usermodel.findOne({ email: req.params.email });
    if (!user) return res.json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.json({ msg: "Error fetching user", error: err.message });
  }
};

const edit = async (req, res) => {
  try {
    const { name, dob, email, role } = req.body;
    await usermodel.updateOne({ email }, { name, dob, role });
    res.json({ msg: "Updated successfully" });
  } catch (err) {
    res.json({ msg: "Error updating user", error: err.message });
  }
};

const del = async (req, res) => {
  try {
    await usermodel.findOneAndDelete({ email: req.params.email });
    res.json({ msg: "Deletion done" });
  } catch (err) {
    res.json({ msg: "Error in deleting user", error: err.message });
  }
};

module.exports = { register, login, get, edit, del, getByEmail };
