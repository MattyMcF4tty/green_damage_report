import React from "react";
import { useRouter } from "next/router";

/* TODO: Come up with better naming scheme to all the pages */
const page1: string = "/damagereport/what";
const page2: string = "/damagereport/how";
const page3: string = "/damagereport/where";
const confirmationPage: string = "/damagereport/confirmation";

const pageIndex: string[] = [page1, page2, page3, confirmationPage];

export function Navbar() {
  const router = useRouter();
  const currentPage = router.pathname;

  const ChangeCircleColor = (page: string) => {
    const targetPageIndex = pageIndex.indexOf(page);
    const currentPageIndex = pageIndex.indexOf(currentPage);

    if (targetPageIndex <= currentPageIndex) {
      return "bg-MainGreen-300 text-white";
    } else {
      return "bg-white text-black";
    }
  };

  const ChangeLineColor = (page: string) => {
    const targetPageIndex = pageIndex.indexOf(page);
    const currentPageIndex = pageIndex.indexOf(currentPage);

    if (targetPageIndex <= currentPageIndex) {
      return "border-t-MainGreen-300";
    } else {
      return "border-t-MainGray-200";
    }
  };

  return (
    <nav className="flex items-center justify-center w-full h-16">
      <img
        src="../GreenLogos/GreenLogo-gray-1.png"
        alt="green"
        className="h-4/6"
      />

      <hr className={`${ChangeLineColor(page2)} border-t-[1.5px] w-10 mx-2`} />
      <img
        src="../GreenLogos/GreenLogo-gray-2.png"
        alt="green"
        className="h-4/6"
      />

      <hr className={`${ChangeLineColor(page3)} border-t-[1.5px] w-10 mx-2`} />
      <img
        src="../GreenLogos/GreenLogo-gray-3.png"
        alt="green"
        className="h-4/6"
      />

      <hr
        className={`${ChangeLineColor(
          confirmationPage
        )} border-t-[1.5px] w-10 mx-2`}
      />
      <img
        src="../GreenLogos/GreenLogo-gray-4.png"
        alt="green"
        className="h-4/6"
      />
    </nav>
  );
}
