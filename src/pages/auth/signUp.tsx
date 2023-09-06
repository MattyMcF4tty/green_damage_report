import { Inputfield } from "@/components/custom_inputfields";
import { handleSignUp, handleVerifyUser } from "@/utils/utils";
import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from 'react';
 
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const token = context.req.cookies["AuthToken"]
  const userVerified = await handleVerifyUser(token);

  if (!userVerified) {
    // Redirect to the admin page
    return {
      redirect: {
        destination: '/auth/signIn',
        permanent: false,
      },
    };
  }

  return {props: {}}
};

const SignUpPage: NextPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const Router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userSignedUp = await handleSignUp(email, password);
        if (userSignedUp) {
            return Router.push("admin/adminPage")
        }
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}
        className="h-[calc(100vh-5.5rem)] w-full flex justify-center items-center bg-MainGreen-200">
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
                    type="text"
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
                    Create new user
                </button>
            </div>
        </form>
    );
};

export default SignUpPage;