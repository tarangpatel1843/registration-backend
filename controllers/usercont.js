let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
const usermodel = require("../model/usermodel")

const register = async (req, res) => {
    try {
        const obj = await usermodel.findOne({ email: req.body.email });
        if (obj) {
            return res.json({ msg: "Account already exists" });
        }
        const pwdhash = await bcrypt.hash(req.body.password, 10);
        const newUser = new usermodel({ ...req.body, password: pwdhash });
        await newUser.save();
        res.json({ msg: "Account created successfully" });
    } catch (err) {
        res.json({ msg: "Error in registration", error: err.message });
    }
};

let login = async (req, res) => {
    try {
        const obj = await usermodel.findOne({ email: req.body.email });
        if (!obj) {
            return res.json({ msg: "user not found" })
        }
        const isMatch = await bcrypt.compare(req.body.password, obj.password)
        if (!isMatch) {
            return res.json({ msg: "Invalid credentials" })
        }
        const token = jwt.sign({ id: obj._id }, "1234");
        res.json({ token, user: obj })
    } catch (err) {
        console.error(err)
        res.json({ err: "err in login" })
    }
}

const get = async (req, res) => {
    try {
        const tasks = await usermodel.find();
        res.json(tasks);
    } catch (err) {
        res.json({ err: err.message });
    }
};
// const get = async (req, res) => {
//   try {
//     const user = await usermodel.findOne({ email: req.params.email }); 
//     if (!user) {
//       return res.json({ msg: "User not found" });
//     }
//     res.json(user); 
//   } catch (err) {
//     res.json({ msg: "Server error", err: err.message });
//   }
// };

// Get single user by email
const getByEmail = async (req, res) => {
    try {
        const user = await usermodel.findOne({ email: req.params.email });
        if (!user) return res.status(404).json({ msg: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

// const edit = async (req, res) => {
//     try {
//         await usermodel.findOneAndUpdate({ email: req.params.email }, req.body, { new: true });
//         res.json({ msg: "User updated successfully" });
//     } catch (err) {
//         res.json({ msg: "Error updating user", err: err.message });
//     }
// };

// Edit user
const edit = async (req, res) => {
    try {
        const { name, dob, email, role } = req.body;
        await usermodel.updateOne({ email }, { name, dob, role });
        res.json({ msg: "Updated successfully" });
    } catch (err) {
        res.json({ err: err.message });
    }
};

let del = async (req, res) => {
    try {
        await usermodel.findOneAndDelete(req.params.email)
        res.json({ "msg": "deletion done" })
    } catch (err) {
        res.json({ "err": "error in deleting task" })
    }
}

module.exports = { register, login, get, edit, del,getByEmail }

