//Import all dependencies
const dotenv = require ('dotenv');
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const routes = require("./db/route");
const cors = require("cors");



const app = express();
app.use(cors());

//Configure ENV File & Require connection file
dotenv.config({path: './config.env'});
require('./db/conn');
const port = process.env.PORT;

//Require model
const Users = require('./models/userSchema');

//this method is used to get data & cookies from frontend
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use("/", routes)

app.get('/',(req,res)=>{
    res.send("Hello World");
})

//Registration
app.post('/register',async(req,res)=>{
    const {name, email, contact, age, gender, password} = req.body
    try{
        //Get body or data
        if (!name || !email || !contact || !age || !gender || !password) {
            return res.status(400).send("All fields are required.");
        }

        console.log(name, email, contact, age, gender, password)

        const createUser = new Users({
            
            name, email, contact, age, gender,
          
            password
        });

        //Save method is used to create or insert user data
        //but before this password will hash because of hashing
        //after hash it will save to database
        // const created = await createUser.save();
        console.log(createUser);
        res.status(200).json("Registered", createUser);
    }catch(error){
        res.status(400).send(error);
    }
})

//Login
// Login User
app.post('/login', async (req, res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        // Find User if Exist
        const user = await Users.findOne({email : email});
        if(user){
            // Verify Password
            const isMatch = await bcryptjs.compare(password, user.password);

            if(isMatch){
                // Generate Token Which is Define in User Schema
                const token = await user.generateToken();
                res.cookie("jwt", token, {
                    // Expires Token in 24 Hours
                    expires : new Date(Date.now() + 86400000),
                    httpOnly : true
                })
                res.status(200).send("LoggedIn")
            }else{
                res.status(400).send("Invalid Credentials");
            }
        }else{
            res.status(400).send("Invalid Credentials");
        }

    } catch (error) {
        res.status(400).send(error);
    }
})


// Appointment Registration
const Appointment = require('./models/appointmentSchema');

app.post('/appointment', async (req, res) => {
    const { name, email, contact, specialty, date, time, reason } = req.body;
    
    try {
        // Check if all required fields are provided
        if (!name || !email || !contact || !specialty || !date || !time || !reason) {
            return res.status(400).json("All fields are required.");
        }
        
        const appointment = new Appointment({
            name,
            email,
            contact,
            specialty,
            date,
            time,
            reason,
        });

        await appointment.save();
        
        return res.status(201).json("Appointment created successfully");
    } catch (error) {
        return res.status(400).json(error.message);
    }
});


//Run Server
app.listen(port,()=>{
    console.log("Server is listening");
})
