import { Inputfield } from "@/components/custom_inputfields";
import { handleSignIn } from "@/utils/utils";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";


const signInPage: NextPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const Router = useRouter()


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const userSignedIn = await handleSignIn(email, password);

        if (userSignedIn) {
            Router.push("/auth/admin/adminPage")
        }
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}
        className="h-[100vh] w-full flex justify-center items-center bg-MainGreen-200">
            <div className="bg-white p-8 rounded-lg w-[30rem] flex flex-col justify-center items-center">
                <div className="w-full mb-10">
                    <Inputfield
                    type="email"
                    labelText="Email"
                    id="email"
                    required={true}
                    value={email}
                    onChange={setEmail}
                    placeHolder="JohnDoe@GreenMobility.com"
                    />

                    <Inputfield
                    type="password"
                    labelText="Password"
                    id="password"
                    required={true}
                    value={password}
                    onChange={setPassword}
                    placeHolder="********"
                    />
                </div>
                <button type="submit"
                className="p-2 bg-MainGreen-300 text-white rounded-sm w-2/3">
                    Sign In
                </button>
            </div>
        </form>
    )
}

export default signInPage;