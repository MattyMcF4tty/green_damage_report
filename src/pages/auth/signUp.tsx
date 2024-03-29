import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { verifySessionToken } from "@/utils/logic/firebaseLogic/authenticationLogic/serverLogic";
import { signInUser } from "@/utils/logic/firebaseLogic/authenticationLogic/clientLogic";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const token = context.req.cookies["AuthToken"];
  const userVerified = token ? await verifySessionToken(token) : false;

  if (!userVerified) {
    return {
      redirect: {
        destination: "/auth/signIn",
        permanent: false,
      },
    };
  }

  return { props: {} };
};

const SignUpPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userSignedUp = await signInUser(email, password);
    if (userSignedUp) {
      return Router.push("admin/adminPage");
    }
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="h-[calc(100vh-5.5rem)] w-full flex justify-center items-center bg-white"
    >
      <img className="absolute top-20 w-1/3 hover:cursor-pointer" onClick={() => Router.push("/")}
      src="../GreenLogos/GreenMobilityTextLogo.png" alt="GreenLogo" />

      <div className=" p-8 border-[1px] border-MainGreen-200 bg-gray-100 rounded-lg w-[30rem] shadow-xl flex flex-col justify-center items-center">
        <div className="w-full mb-10">
          <div className="flex flex-col ">
            <label htmlFor="email" className="mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="text"
              className="h-10 rounded-md border-[1px] border-MainGreen-200 pl-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Greenmobility@example.com"
            />
          </div>

          <div className="flex flex-col mt-5">
            <label htmlFor="Password" className="mb-2">
              Password
            </label>
            <input
              id="Password"
              name="Password"
              type="password"
              className="h-10 rounded-md border-[1px] border-MainGreen-200 pl-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>
        </div>
        <button
          type="submit"
          className="p-2 bg-white border-[1px] border-MainGreen-200 text-MainGreen-300 rounded-md w-2/3 hover:duration-200 hover:bg-MainGreen-300 hover:text-white"
        >
          Create new user
        </button>
      </div>
    </form>
  );
};

export default SignUpPage;