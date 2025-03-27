"use client"

import { useUserContext } from '@/context/userContext'
import React, { useState } from 'react'
import toast from 'react-hot-toast';

function ChangePasswordForm() {

    const {changePassword} = useUserContext();

    const [showCurrentPassword,setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    
    const newPasswordChange = (e: any) => {
      setNewPassword(e.target.value);
    };
  
    const currentPasswordChange = (e: any) => {
      setCurrentPassword(e.target.value);
    };
  
    const toggleNewPassword = () => {
      setShowNewPassword(!showNewPassword);
    };
    const toggleCurrentPassword = () => {
      setShowCurrentPassword(!showCurrentPassword);
    };

    const handleSubmit = (e: any) => {
      e.preventDefault();
  
      if (currentPassword === newPassword) {
        toast.error("Current and new passwords cant be same!");
        return;
      }
  
      changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
    };



  return (
    <form className=" ml-0 mt-0 m-[2rem] px-10 py-14 rounded-lg bg-white max-w-[520px] w-full">
    <div className="relative z-10">
      <h1 className="mb-2 text-center text-[1.35rem] font-medium">
        Change Your Password!
      </h1>
      <div className="relative mt-[1rem] flex flex-col">
        <label htmlFor="email" className="mb-1 text-[#999]">
          Current Password
        </label>
        <input
          type={showCurrentPassword ? "text" : "password"}
          value={currentPassword}
          onChange={currentPasswordChange}
          id="password"
          name="password"
          placeholder="*********"
          className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
        />
        <button
          className="absolute p-1 right-4 top-[43%] text-[22px] text-[#999] opacity-45"
          onClick={toggleCurrentPassword}
          type="button"
        >
          {showCurrentPassword ? (
            <i className="fas fa-eye-slash"></i>
          ) : (
            <i className="fas fa-eye"></i>
          )}
        </button>
      </div>
      <div className="relative mt-[1rem] flex flex-col">
        <label htmlFor="email" className="mb-1 text-[#999]">
          New Password
        </label>
        <input
          type={showNewPassword ? "text" : "password"}
          value={newPassword}
          onChange={newPasswordChange}
          id="password"
          name="password"
          placeholder="*********"
          className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
        />
        <button
          className="absolute p-1 right-4 top-[43%] text-[22px] text-[#999] opacity-45"
          onClick={toggleNewPassword}
          type="button"
        >
          {showNewPassword ? (
            <i className="fas fa-eye-slash"></i>
          ) : (
            <i className="fas fa-eye"></i>
          )}
        </button>
      </div>
      <div className="flex">
        <button
          type="submit"
          onClick={handleSubmit}
          className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-[#2ECC71] text-white rounded-md hover:bg-[#1abc9c] transition-colors"
        >
          Reset Password
        </button>
      </div>
    </div>
    <img src="/flurry.png" alt="" />
  </form>
  )
}

export default ChangePasswordForm