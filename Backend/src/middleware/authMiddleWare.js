import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/auth/UserModel.js";

export const protect = asyncHandler(async (req,res,next)=>{
    try {
        //check if user is logged in
        const token = req.cookies.token;
        if(!token){
            //401 unauthorized
            res.status(401).json({"message":"Not authorized, please Login!"});
        }
        // verify the token
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        //get the user details from the token --> exclude the password
        const user = await User.findById(decoded.id).select("-password");
        //check if user exists
        if(!user){
            res.status(404).json({"message":"User Not Found"});
        }
        //set user details in the request object
        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({"message":"Not authorized, please Login!"});
    }
});


//admin middelware

export const adminMiddleware = asyncHandler(async (req,res,next)=>{
     if(req.user && req.user.role ==="admin"){
        //if user is admin, move to the next middelware,controller
        next();
        return;
     }

     res.status(403).json({"message":"Only Admins can do this!"});
     //if not admin, send 403 forbidded --> terminate request
});

export const creatorMiddleware = asyncHandler(async (req,res,next)=>{
    if((req.user && req.user.role ==="creator")||(req.user && req.user.role ==="admin")){
       //if user is creator , move to the next middelware,controller
       next();
       return;
    }

    res.status(403).json({"message":"Only creators can do this!"});
    //if not admin, send 403 forbidded --> terminate request
});

// verified middleware

export const verifiedMiddleware = asyncHandler(async (req,res,next)=>{
    if(req.user && req.user.isVerified){
       //if user is verified , move to the next middelware,controller
       next();
       return;
    }

    res.status(403).json({"message":"Please verify your email address!"});
    //if not admin, send 403 forbidded --> terminate request
});