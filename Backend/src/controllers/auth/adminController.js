import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModel.js";

export const deleteUser =  asyncHandler(async  (req,res)=>{
    const {id} = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if(!user){
            res.status(404).json({"message":"User Not Found"});
        }
        res.status(200).json({"message":"User deleted succesfully"});
    } catch (error) {
        res.status(500).json({"message":"Cannot Delete User"});
    }
});

export const getAllUsers = asyncHandler(async (req,res)=>{

    try {
        const users = await User.find({});
        if(!users){
            res.status(400).json({"message":"No users found"});
        }
            res.status(200).json(users);
    } catch (error) {
        res.status(500).json({"message":"Cannot get users"});
    }
});
