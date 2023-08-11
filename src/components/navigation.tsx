import React from "react";
import { useRouter } from "next/router";

/* TODO: Come up with better naming scheme to all the pages */
const page1: string = "/damagereport/what";
const page2: string = "/damagereport/how";
const page3: string = "/damagereport/where";
const confirmationPage: string = "/damagereport/confirmation";

const pageIndex: { page: string; color: boolean }[] = [
  { page: page1, color: false },
  { page: page2, color: false },
  { page: page3, color: false },
  { page: confirmationPage, color: false },
];

export function Navbar() {
  const router = useRouter();
  const currentPage = router.pathname;

  pageIndex.forEach((item) => {
    if (
      item.page === currentPage ||
      pageIndex.findIndex((page) => page.page === currentPage) >=
        pageIndex.findIndex((page) => page.page === item.page)
    ) {
      item.color = true;
    }
  });

  const ChangeLineColor = (page: string) => {
    const pageIndexEntry = pageIndex.find((item) => item.page === page);

    if (pageIndexEntry && pageIndexEntry.color) {
      return "border-t-MainGreen-300";
    } else {
      return "border-t-MainGray-200";
    }
  };

  return (
    <nav className="flex items-center justify-center w-full h-16">
      {pageIndex[0].color ? (
        <img
          src="../GreenLogos/GreenLogo-color-1.png"
          alt="green"
          className="h-4/6"
        />
      ) : (
        <img
          src="../GreenLogos/GreenLogo-gray-1.png"
          alt="green"
          className="h-4/6"
        />
      )}

      <hr className={`${ChangeLineColor(page2)} border-t-[1.5px] w-10 mx-2`} />
      {pageIndex[1].color ? (
        <img
          src="../GreenLogos/GreenLogo-color-2.png"
          alt="green"
          className="h-4/6"
        />
      ) : (
        <img
          src="../GreenLogos/GreenLogo-gray-2.png"
          alt="green"
          className="h-4/6"
        />
      )}

      <hr className={`${ChangeLineColor(page3)} border-t-[1.5px] w-10 mx-2`} />
      {pageIndex[2].color ? (
        <img
          src="../GreenLogos/GreenLogo-color-3.png"
          alt="green"
          className="h-4/6"
        />
      ) : (
        <img
          src="../GreenLogos/GreenLogo-gray-3.png"
          alt="green"
          className="h-4/6"
        />
      )}

      <hr
        className={`${ChangeLineColor(
          confirmationPage
        )} border-t-[1.5px] w-10 mx-2`}
      />
      {pageIndex[3].color ? (
        <img
          src="../GreenLogos/GreenLogo-color-4.png"
          alt="green"
          className="h-4/6"
        />
      ) : (
        <img
          src="../GreenLogos/GreenLogo-gray-4.png"
          alt="green"
          className="h-4/6"
        />
      )}
    </nav>
  );
}
