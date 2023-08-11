import React from "react";

const AdminNavbar = () => {
  return (
    <div className="bg-MainGreen-300 flex flex-row h-14">
      <div className="flex flex-row items-center">
        <img src="../GreenLogo.png" alt="GreenLogo" className="h-full" />
        <p className="text-white ml-3 font-semibold">Admin</p>
      </div>
    </div>
  );
};

export default AdminNavbar;
