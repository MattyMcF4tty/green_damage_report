import React, { useEffect } from 'react';
import { NextRouter, useRouter } from 'next/router';

/* TODO: Come up with better naming scheme to all the pages */
const page1:string = "/what";
const page2:string = "/how";
const page3:string = "/where";
const page4:string = "/when";
const confirmationPage:string = "/confirmation";

const pageIndex:string[] = [page1, page2, page3, page4, confirmationPage];

export function Navbar() {
  const router = useRouter();
  const currentPage = router.pathname;


  const ChangeCircleColor = (page: string) => {
    const targetPageIndex = pageIndex.indexOf(page);
    const currentPageIndex = pageIndex.indexOf(currentPage);

    if (targetPageIndex <= currentPageIndex) {
      return ("bg-MainGreen-300 text-white");
    }
    else {
      return ("bg-white text-black");
    };
  };

  const ChangeLineColor = (page: string) => {
    const targetPageIndex = pageIndex.indexOf(page);
    const currentPageIndex = pageIndex.indexOf(currentPage);

    if (targetPageIndex <= currentPageIndex) {
      return ("border-MainGreen-300");
    }
    else {
      return ("border-white");
    };
  };

  return (
    <nav className="flex items-center justify-center w-full h-16 bg-MainGreen-200">
        <p  className={`${ChangeCircleColor(page1)}
            h-10 w-10 rounded-full text-lg text-center leading-10`}
        >
            1
        </p>

        <hr className={`${ChangeLineColor(page2)} border-[1px] w-10 mx-2`} />
        <p  className={`${ChangeCircleColor(page2)}
            h-10 w-10 rounded-full text-lg text-center leading-10`}
        >
            2
        </p>

        <hr className={`${ChangeLineColor(page3)} border-[1px] w-10 mx-2`} />
        <p  className={`${ChangeCircleColor(page3)}
            h-10 w-10 rounded-full text-lg text-center leading-10`}
        >
            3
        </p>

        <hr className={`${ChangeLineColor(page4)} border-[1px] w-10 mx-2`} />
        <p  className={`${ChangeCircleColor(page4)}
            h-10 w-10 rounded-full text-lg text-center leading-10`}
        >
            4
        </p>
    </nav>
  );
}


/* TODO: make it so that you cant continue without having filled out nessecary information on page
note: the buttons should not be disabled when this is true, it should tell you which inputfields are missing -
as if it was a part of the form
*/
export function NavButtons() {
  const router:NextRouter = useRouter();
  const currentPage:string = router.pathname;
  const previousDisabled: boolean = currentPage === page1;

  const handleNextPage = () => {
    if (currentPage.includes(page1)) {
      router.push(page2)
    } 
    else if (currentPage.includes(page2)) {
      router.push(page3)
    }
    else if (currentPage.includes(page3)) {
      router.push(page4)
    }
    else if (currentPage.includes(page4)) {
      router.push(confirmationPage)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage.includes(page2)) {
      router.push(page1)
    }
    else if (currentPage.includes(page3)) {
      router.push(page2)
    }
    else if (currentPage.includes(page4)) {
      router.push(page3)
    }
    else if (currentPage.includes(confirmationPage)) {
      router.push(page4)

    } 
  };

  function ChangePreviousColor() {
    if (previousDisabled) {
      return ("bg-MainGreen-300 text-white bg-opacity-60")
    }
    else return ("bg-MainGreen-300 text-white")
  }

  return(
    <div className="flex flex-row w-full place-content-between h-10 mt-10">
      <button 
      onClick={handlePreviousPage} 
      disabled={previousDisabled} 
      className={`w-2/5 ${ChangePreviousColor()}`}
      >
        Previous
      </button>
      <button 
      className="w-2/5 bg-MainGreen-300 text-white"
      onClick={handleNextPage}
      >
        Next
      </button>
    </div>
  )
}