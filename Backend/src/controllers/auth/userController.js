import asyncHandler from 'express-async-handler';
import User from '../../models/auth/UserModel.js';
import { generateToken } from '../../helpers/generateToken.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Token from '../../models/auth/Token.js';
import crypto from "node:crypto";
import hashToken from '../../helpers/hashToken.js';
import sendEmail from '../../helpers/Email.js';
//register the user details
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
        return res.status(400).json({message:"User Already exists"});
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
        res.status(400).json({message:"Invalid User data"});
    }
});

//login the user
export const loginUser = asyncHandler(async (req,res)=>{
    //get email and password from the req.body

    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({message:"All Fields are required"});
    }

    // check if user exists

    const userExist = await User.findOne({email});
    if(!userExist){
        return res.status(404).json({message:"User Not Found, Sign Up!"});
    }

    // check if the password matches the hashed password in the database
    const isMatch = await bcrypt.compare(password, userExist.password);
    if(!isMatch){
        return res.status(400).json({message:"Invalid Credentials"});
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
        return res.status(400).json({message:"Invalid email or password"});
    }
});

//logout user

export const logoutUser = asyncHandler(async (req,res)=>{
    res.clearCookie("token");
    res.status(200).json({message:"User Logged Out"});
});

//get user profile

export const getUser = asyncHandler(async (req,res)=>{
    //get user details from the token --> exclude password
    const user = await User.findById(req.user._id).select("-password");

    if(user){
        res.status(200).json(user);
    }
    else{
        //404 Not Found
        res.status(404).json({message:"User Not Found"});
    }

});
//update user details
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
        res.status(404).json({message:"User not found"});
    }

});

//check user login status
export const userLoginStatus = asyncHandler(async (req,res)=>{
    const token = req.cookies.token;

    if(!token){
        res.status(401).json({message:"Not Authorized, please login"});
    }
    //verify the token
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    if(decoded){
        res.status(200).json(true);
    }else{
        //401 unauthorized
        res.status(200).json(false);
    }
});

//email verification

export const verifyEmail  = asyncHandler (async(req,res)=>{
    const user = await User.findById(req.user._id);

    if(!user){
        return res.status(404).json({message:"User Not Found"});
    }

    if(user.isVerified){
        return res.status(400).json({message:"User is already verified"});
    }

    let token = await Token.findOne({userId: user._id});
    //if token exits --> delete the existing token
    if(token){
        await token.deleteOne();
    }

    // create a verification token using the user id----> crypto

    const verificationToken = crypto.randomBytes(64).toString("hex") + user._id;

    //hash the verificatin token

    const hashedToken = hashToken(verificationToken);

    await new Token({
        userId: user._id,
        verificationToken: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now()+ 60*60*24*1000, //24 hours
    }).save();

    //verificationLink = 

    const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    //send email

    const subject = "Email Verification - AuthKit";
    const send_to = user.email;
    const reply_to = "noreply@gmail.comm";
    const template = "emailVerification";
    const send_from = process.env.USER_EMAIL;
    const name = user.name;
    const url = verificationLink;

    try {
        await sendEmail(subject,send_to,send_from,reply_to,template,name,url);
        return res.status(200).json({message:"Email sent"});

    } catch (error) {
        console.log("Error Sending Email",error);
        return res.status(500).json({message:"Email could not be send"});

    }
})


//verify user

export const verifyUser = asyncHandler(async(req,res)=>{
    const {verificationToken} = req.params;

    if(!verificationToken){
        return res.status(400).json({message:"Invalid Verification Token"});
    }

    const hashedToken = hashToken(verificationToken);

    //find the user with verification token

    const userToken = await Token.findOne({verificationToken: hashedToken,
        expiresAt: { $gt: Date.now()},
    });

    if(!userToken){
        return res.status(400).json({message:"Invalid or expired verification Token"});
    }

    const user = await User.findById(userToken.userId);

    if(user.isVerified){
        return res.status(400).json({message:"User Already Verified"});

    }
    user.isVerified = true;
    await user.save();
    res.status(200).json({message:"User Verified"});

});

//forgot password

export const  forgotPassword = asyncHandler(async (req,res)=>{
    const {email} = req.body;

    if(!email){
        return res.status(400).json({message:"Email is required"});
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({message: "User not found"});
    }

    let token = await Token.findOne({userId: user._id});

    if(token){
        await token.deleteOne();
    }

    const passwordResetToken = crypto.randomBytes(65).toString("hex") + user._id;

    const hashedToken = hashToken(passwordResetToken);

    await new Token({
        userId: user._id,
        passwordResetToken: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 1000*60*60, //1hour
    }).save();

    //reset link

    const resetLink =`${process.env.CLIENT_URL}/reset-password/${passwordResetToken}`;
    const subject = "Password Reset - AuthKit";
    const send_to = user.email;
    const reply_to = "noreply@gmail.comm";
    const template = "forgotPassword";
    const send_from = process.env.USER_EMAIL;
    const name = user.name;
    const url = resetLink;

    try {
        await sendEmail(subject,send_to,send_from,reply_to,template,name,url);
        return res.status(200).json({message:"Email sent"});
    } catch (error) {
        console.log("Error sending emain: ",error);
        return res.status(500).json({message:"Email could not be send"});
    }

});