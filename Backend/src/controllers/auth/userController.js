import asyncHandler from 'express-async-handler';
import User from '../../models/auth/UserModel.js';
import { generateToken } from '../../helpers/generateToken.js';
import bcrypt from "bcrypt";

export const registerUser = asyncHandler(async (req,res)=>{
    const{name,email,password} = req.body;

    if(!name || !email || !password){
        res
        .status(400)
        .json({message: "All fields are required"});
    }

    if(password.length<6){
        return res
            .status(400)
            .json({message: "Password must be at least 6 characters"});
    }

    const userExist = await User.findOne({email});
    if(userExist){
        //bad request
        return res.status(400).json({"message":"User Already exists"});
    }

    // create new user

    const user = await User.create({
        name,
        email,
        password,
    });

    //generate token with user id

    const token = generateToken(user._id);

    //send back the user and token in the response to the client

    res.cookie("token",token, {
        path: "/",
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: true,
        secure: true,
    });

    if(user){
        const{ _id, name, email, role, photo , bio, isVerified} = user;

        //201 created

        res.status(201).json({
            _id, 
            name, 
            email, 
            role, 
            photo, 
            bio, 
            isVerified,
            token,
        });
    }
    else{
        res.status(400).json({"message":"Invalid User data"});
    }
});


export const loginUser = asyncHandler(async (req,res)=>{
    //get email and password from the req.body

    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({"message":"All Fields are required"});
    }

    // check if user exists

    const userExist = await User.findOne({email});
    if(!userExist){
        return res.status(404).json({"message":"User Not Found, Sign Up!"});
    }

    // check if the password matches the hashed password in the database
    const isMatch = await bcrypt.compare(password, userExist.password);
    if(!isMatch){
        return res.status(400).json({"message":"Invalid Credentials"});
    }
    
    //generate token with user id

    const token = generateToken(userExist._id);
    if(userExist && isMatch){
        const{_id, name, email, role, photo, bio, isVerified} = userExist;

        //set the token is the cookie

        res.cookie("token",token, {
            path: "/",
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            sameSite: true,
            secure: true,
        });

        //send back the user and token in the response to the client

        res.status(200).json({
            _id, 
            name, 
            email, 
            role, 
            photo, 
            bio, 
            isVerified,
            token,
        });
    }
    else{
        return res.status(400).json({"message":"Invalid email or password"});
    }
});

//logout user

export const logoutUser = asyncHandler(async (req,res)=>{
    res.clearCookie("token");
    res.status(200).json({"message":"User Logged Out"});
});

//get user profile;

export const getUser = asyncHandler(async (req,res)=>{
    //get user details from the token --> exclude password
    const user = await User.findById(req.user._id).select("-password");

    if(user){
        res.status(200).json(user);
    }
    else{
        //404 Not Found
        res.status(404).json({"message":"User Not Found"});
    }

});

export const updateUser  = asyncHandler(async (req,res)=>{
    // get user details from the token -->> protect middleware
    const user = await User.findById(req.user._id);

    if(user){
        //user properties to update
        const {name,bio,photo} = req.body;
        //update the user properties
        user.name = req.body.name || user.name;
        user.bio = req.body.bio || user.bio;
        user.photo = req.body.photo || user.photo;

        const updated = await user.save();

        res.status(200).json({
            _id: updated._id, 
            name: updated.name, 
            email: updated.email, 
            role: updated.role, 
            photo: updated.photo, 
            bio: updated.bio, 
            isVerified: updated.isVerified,
        });
    }
    else{
        //404 not found
        res.status(404).json({"message":"User not found"});
    }

});
