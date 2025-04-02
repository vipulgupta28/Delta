import React from "react";
import { useNavigate } from "react-router-dom";

 const ForgotPassword:React.FC = () =>{

    const navigate = useNavigate();

    const savePassword = () =>{
        navigate("/loginpage");

    }
    return(
        <>

        <div className="min-h-screen flex flex-col justify-center items-center gap-10">

        <h1 className="text-5xl font-bold">Reset Password</h1>

        <div className="flex flex-col gap-3">
            <label>New Password</label>
        <input
            type="text"
            className="border w-100 p-3 rounded-[6px]"
            placeholder="New Password"
            />

        </div>
            
        <div className="flex flex-col gap-3">
            <label>Confirm Password</label>
        <input
            type="text"
            className="border w-100 p-3 rounded-[6px]"
            placeholder="Confirm Password"
            />

        </div>
            <button
            onClick={savePassword}
             className="bg-white text-black p-3 w-100 rounded-[6px] font-medium hover:cursor-pointer hover:bg-gray-200 animation duration-400">Save</button>

        </div>
           
        </>
    )
}

export default ForgotPassword;