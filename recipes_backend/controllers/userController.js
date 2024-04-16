const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const {hash} = require("bcrypt");
const path = require("path");
//@desc Register a user
//@ route POST /users/register
//@access public
const registerUser = asyncHandler(async (req,res) => {
    const{username, email, password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!")
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered!")
    }
    //Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);
    //console.log("Hashed Password: ", hashedPassword);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });
    console.log(`User created ${user}`);
    if(user){
        const htmlFile = path.join(__dirname, '../public/html/index.html');
        res.sendFile(htmlFile);
        //res.status(201).json({_id:user.id, email: user.email});
    }
    else{
        res.status(400);
        throw new Error("User data is not valid");
    }
    //res.json({message: "Register the user"});
});

//@desc Login user
//@ route POST /users/login
//@access public
const loginUser = asyncHandler(async (req,res) => {
    const{email, password} = req.body;
    console.log(req.body)
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const user =  await User.findOne({email});
    //compare password with bcrypt hashed password
    if(user && (await bcrypt.compare(password,user.password))){
        const accessToken = jwt.sign(
            {
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            },
        }, process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "15m"}
            );
        //res.status(200).json({accessToken});
    }else{
        res.status(401)
        throw new Error("Invalid Email or Password!")
    }
    const htmlFile = path.join(__dirname, '../public/html/main.html');
    res.sendFile(htmlFile);
});

//@desc Current user info
//@ route POST /users/current
//@access private
const currentUser = asyncHandler(async (req,res) => {
    res.json(req.user);
});

module.exports = {registerUser, loginUser, currentUser};