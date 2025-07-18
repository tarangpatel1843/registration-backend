const express =require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./route/userroute'); 
const app=express()

mongoose.connect('mongodb://localhost:27017/users').then(()=>{
    console.log("okay")
})

app.use(cors())
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use('/', userRoutes);

app.listen(5000)