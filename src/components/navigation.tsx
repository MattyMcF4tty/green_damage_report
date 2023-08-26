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

  const updatedPageIndex = pageIndex.map((item) => ({
    ...item,
    color:
      item.page === currentPage ||
      pageIndex.findIndex((page) => page.page === currentPage) >=
        pageIndex.findIndex((page) => page.page === item.page),
  }));

  const ChangeLineColor = (page: string) => {
    const pageIndexEntry = updatedPageIndex.find((item) => item.page === page);

    if (pageIndexEntry && pageIndexEntry.color) {
      return "border-t-MainGreen-300";
    } else {
      return "border-t-MainGray-200";
    }
  };

  return (
    <nav className="flex items-center justify-center w-full h-16">
      {updatedPageIndex.map((item, index) => (
        <React.Fragment key={item.page}>
          <img
            src={`../GreenLogos/GreenLogo-${item.color ? "color" : "gray"}-${
              index + 1
            }.png`}
            alt="green"
            className="h-4/6"
          />
          {index < updatedPageIndex.length - 1 && (
            <hr
              className={`${ChangeLineColor(
                item.page
              )} border-t-[1.5px] w-10 mx-2`}
            />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
