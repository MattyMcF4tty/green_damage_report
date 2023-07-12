import React from "react";
import { useRouter } from "next/router";

/* TODO: Come up with better naming scheme to all the pages */
const page1: string = "/what";
const page2: string = "/how";
const page3: string = "/where";
const confirmationPage: string = "/confirmation";

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
      return "border-MainGreen-300";
    } else {
      return "border-white";
    }
  };

  return (
    <nav className="flex items-center justify-center w-full h-16 bg-MainGreen-200">
      <p
        className={`${ChangeCircleColor(page1)}
            h-10 w-10 rounded-full text-lg text-center leading-10`}
      >
        1
      </p>

      <hr className={`${ChangeLineColor(page2)} border-[1px] w-10 mx-2`} />
      <p
        className={`${ChangeCircleColor(page2)}
            h-10 w-10 rounded-full text-lg text-center leading-10`}
      >
        2
      </p>

      <hr className={`${ChangeLineColor(page3)} border-[1px] w-10 mx-2`} />
      <p
        className={`${ChangeCircleColor(page3)}
            h-10 w-10 rounded-full text-lg text-center leading-10`}
      >
        3
      </p>

      <hr
        className={`${ChangeLineColor(
          confirmationPage
        )} border-[1px] w-10 mx-2`}
      />
      <p
        className={`${ChangeCircleColor(confirmationPage)}
            h-10 w-10 rounded-full text-lg text-center leading-10`}
      >
        4
      </p>
    </nav>
  );
}