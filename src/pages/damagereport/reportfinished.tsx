import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

const ReportFinishedPage: NextPage = () => {
    const router = useRouter()
    return (
        <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-MainGreen-300 flex flex-col items-center">
            <h1 className="mt-32 text-6xl text-white">Sorry the report your trying to acces is already finished</h1>
            <button onClick={() => router.push("/")}
            className="">
                Return
            </button>
        </div>
    )
}

export default ReportFinishedPage;