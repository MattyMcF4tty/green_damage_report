import { handleSignOut } from "@/utils/utils";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React from "react";

const AdminNavbar = () => {
  const Router = useRouter();

  const handleLogOut = () => {
    handleSignOut();
    Router.push("");
  };
  return (
    <div className="bg-MainGreen-300 flex flex-row h-14 w-full ">
      <div
        className="flex flex-row items-center hover:cursor-pointer"
        onClick={() => Router.push("/auth/admin/adminPage")}
      >
        <img
          src="../../GreenLogos/GreenLogo-color.png"
          alt="GreenLogo"
          className="h-full"
        />
        <p className="text-white ml-3 font-semibold">Admin</p>
      </div>
      <div className="flex justify-end w-full">
        <div>
          <button
            className="pr-2 border-l-2 h-full pl-2 text-white hover:text-lg hover:text-white w-[8rem]"
            type="button"
            onClick={() => Router.push("/auth/signUp")}
          >
            New user
          </button>
        </div>
        <div className="h-full text-white font-bold ">
          <button
            type="button"
            onClick={() => handleLogOut()}
            className="border-l-2 h-full w-[4rem] text-xl hover:bg-red-500 duration-150"
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
