import express from "express";
import { changePassword, forgotPassword, getUser, loginUser, logoutUser, registerUser, resetPassword, updateUser, userLoginStatus, verifyEmail, verifyUser } from "../controllers/auth/userController.js";
import { adminMiddleware, creatorMiddleware, protect } from "../middleware/authMiddleWare.js";
import { deleteUser, getAllUsers } from "../controllers/auth/adminController.js";

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/logout",logoutUser);
router.get("/user",protect,getUser);
router.patch("/user",protect,updateUser);

//admin route

router.delete("/admin/users/:id",protect,adminMiddleware, deleteUser);

//get all users
router.get("/admin/users",protect,creatorMiddleware, getAllUsers);

//login status

router.get("/login-status",userLoginStatus);

//email verification
router.post("/send-email",protect,verifyEmail);

//verify user

router.post("/verify-user/:verificationToken",verifyUser);

//forgot password

router.post("/forgot-password", forgotPassword);

//reset password

router.post("/reset-password/:passwordResetToken",resetPassword);

//change password --> user must be logged in

router.patch("/change-password",protect,changePassword);


export default router;