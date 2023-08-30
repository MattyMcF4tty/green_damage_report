import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

const ReportFinishedPage: NextPage = () => {
    const router = useRouter()
    return (
        <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-white flex flex-col justify-center items-center">
            <div className="w-full relative flex items-center justify-center flex-col
            mb-20">
            <img src="..\GreenLogos\GreenLogo-color.png" alt="Logo"
                className="z-10 absolute
                lg:w-20 lg:ml-[60.2rem] lg:-top-[3.9rem] lg:rotate-20
                w-40 -top-[10rem]" />
                <h1 className="font-thin relative text-MainGreen-300
                lg:text-4xl
                text-2xl text-center">
                    The report you're trying to access has already been submitted</h1>
            </div>
            <button onClick={() => router.push("/")}
            className="border-[1px] border-MainGreen-300 p-2 rounded-md hover:text-white hover:bg-MainGreen-300 duration-150">
                Return to homepage
            </button>
        </div>
    )
}

export default ReportFinishedPage;