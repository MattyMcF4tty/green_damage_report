import { handleSignOut } from "@/utils/utils";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React from "react";

const AdminNavbar = () => {
  const Router = useRouter()


  const handleLogOut = () => {
    handleSignOut()
    Router.push("")
  }
  return (
    <div className="bg-MainGreen-300 flex flex-row h-14 w-full justify-between">
      <div className="flex flex-row items-center left-0">
        <img src="../GreenLogo.png" alt="GreenLogo" className="h-full" />
        <p className="text-white ml-3 font-semibold">Admin</p>
      </div>
      <div className="right-0 text-white font-bold">
        <button type="button"onClick={() => Router.push("/auth/signUp")}
        className="border-l-2 h-full w-[6rem] hover:bg-white duration-150 hover:text-MainGreen-300">
          New user
        </button>
        <button type="button" onClick={() => handleLogOut()}
        className="border-l-2 h-full w-[4rem] text-xl hover:bg-red-500 duration-150">
        <FontAwesomeIcon icon={faArrowRightFromBracket} />
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
