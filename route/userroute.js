const express = require('express')
const router = express.Router()

const { register, login, get, edit, del, getByEmail } = require('../controllers/usercont')


router.post("/register", register)
router.post("/login", login)
router.get("/get",get)

// Get user by email (for editing)
router.get("/get/:email", getByEmail);
router.put('/edit/:email', edit)

router.delete("/del/:email", del)
module.exports = router;