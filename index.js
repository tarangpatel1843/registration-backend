const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./route/userroute');
const app = express();
require('dotenv').config();

// Load from .env
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_URL = process.env.CLIENT_URL;


mongoose.connect(MONGO_URI).then(() => {
    console.log("MongoDB connected successfully.");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});


app.use(cors({ origin: 'https://registration-frontend-l8ybq1v8z-tarangs-projects-220ff129.vercel.app', credentials: true }));
app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});


app.use('/', userRoutes);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

