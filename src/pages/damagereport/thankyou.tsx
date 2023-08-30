import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

const ThankYouPage: NextPage = () => {
    const router = useRouter()
    return (
        <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-white flex flex-col justify-center items-center">
            <div className="w-full relative flex items-center justify-center flex-col mb-20">
            <img src="..\GreenLogos\GreenLogo-color.png" alt="Logo"
                className="w-20 rotate-20 ml-[76.4rem] -top-[3.6rem] z-10 absolute" />
                <h1 className="font-thin text-4xl relative text-MainGreen-300">
                Thank you for your report. It will now be processed by our damage department</h1>
            </div>
            <button onClick={() => router.push("/")}
            className="border-[1px] border-MainGreen-300 p-2 rounded-md hover:text-white hover:bg-MainGreen-300 duration-150">
                Return to homepage
            </button>
        </div>
    )
}

export default ThankYouPage;