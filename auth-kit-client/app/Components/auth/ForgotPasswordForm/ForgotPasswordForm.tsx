"use client"

import { useUserContext } from '@/context/userContext'
import React, { useState } from 'react'

function ForgotPasswordForm() {

    const {forgotPasswordEmail} = useUserContext();

    const[email,setEmail] = useState("");
    
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
      setEmail(e.target.value);
    };

    const handleSubmit = (e:any)=>{
      e.preventDefault();
      forgotPasswordEmail(email);

      //clear input
      setEmail("");
    };



  return (
    <form className='m-[2rem] px-10 py-14 rounded-lg bg-white max-w-[520px] w-full'>
      <div className='relative z-10'>
        <h1 className="mb-2 text-center text-[1.35rem] font-medium">
          Enter email to reset password
        </h1>
        <div className='me-[1rem] flex flex-col'>
          <label htmlFor="email" className="mb-1 text-[#999]">
            Email
            </label>
            <input 
              type="text"
              value={email}
              onChange={handleEmailChange}
              name="email"
              className="px-4 py-3 border-[2px] rounded-md outline-[#2ecc71] text-gray"
              placeholder="johndoe@gmail.com"
            />
        </div>
        <div className='flex'>
          <button 
            type="submit"
            onClick={handleSubmit}
            className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-[#2ecc71] text-white rounded-md hover:bg-[#1abc9c] transition-colors"
          >
            Reset Password
          </button>
        </div>
      </div>
    </form>
  )
}

export default ForgotPasswordForm