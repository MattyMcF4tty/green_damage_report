import { useEffect, useState } from "react";

interface vanDrawingProps {
  setShowOne: (visible: boolean) => void;
  setShowTwo: (visible: boolean) => void;
  setShowThree: (visible: boolean) => void;
  setShowFour: (visible: boolean) => void;
  setShowFive: (visible: boolean) => void;
  setShowSix: (visible: boolean) => void;
  setShowSeven: (visible: boolean) => void;
  setShowEight: (visible: boolean) => void;
  setShowNine: (visible: boolean) => void;
}

const VanDrawing = ({
  setShowOne,
  setShowTwo,
  setShowThree,
  setShowFour,
  setShowFive,
  setShowSix,
  setShowSeven,
  setShowEight,
  setShowNine,
}: vanDrawingProps) => {
  return (
    <div className="w-[22rem] relative">
      <button
        type="button"
        onClick={() => setShowOne(true)}
        className="absolute bg-MainGreen-300 text-white rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem] lg:text-3xl lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:hover:flex lg:hover:justify-center lg:hover:pr-[0.5rem] lg:duration-150 
        w-[1.3rem] h-[1.3rem] lg:flex lg:items-center  text-xs top-[5.02rem] left-[3.03rem] hover:w-[1.6rem] hover:h-[1.6rem] hover:left-[2.88rem] hover:top-[4.87rem]  duration-150 text-center  
        "
      >
        1
      </button>
      <button
        type="button"
        onClick={() => setShowTwo(true)}
        className="absolute bg-MainGreen-300 text-white rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem] lg:text-3xl lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:hover:flex lg:hover:justify-center lg:hover:pr-[0.5rem] lg:duration-150 
        w-[1.3rem] h-[1.3rem] lg:flex lg:items-center text-xs top-[4rem] left-[6.3rem] hover:w-[1.6rem] hover:h-[1.6rem] hover:top-[3.7rem]  duration-150 text-center 
        "
      >
        2
      </button>
      <button
        type="button"
        onClick={() => setShowThree(true)}
        className="absolute bg-MainGreen-300 text-white rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem] lg:text-3xl lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:hover:flex lg:hover:justify-center lg:hover:pr-[0.5rem] lg:duration-150 
        w-[1.3rem] h-[1.3rem] lg:flex lg:items-center text-xs top-[2rem] left-[9.2rem] hover:w-[1.6rem] hover:h-[1.6rem] hover:top-[2rem] duration-150 text-center
        "
      >
        3
      </button>
      <button
        type="button"
        onClick={() => setShowFour(true)}
        className="absolute bg-MainGreen-300 text-white rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem] lg:text-3xl lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:hover:flex lg:hover:justify-center lg:hover:pr-[0.5rem] lg:duration-150 
        w-[1.3rem] h-[1.3rem] lg:flex lg:items-center text-xs top-[5.02rem] left-[11.18rem] hover:w-[1.6rem] hover:h-[1.6rem] hover:left-[11.02rem] hover:top-[4.88rem] duration-150 text-center
        "
      >
        4
      </button>
      <button
        type="button"
        onClick={() => setShowFive(true)}
        className="absolute bg-MainGreen-300 text-white rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem] lg:text-3xl lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:hover:flex lg:hover:justify-center lg:hover:pr-[0.5rem] lg:duration-150 
        w-[1.3rem] h-[1.3rem] lg:flex lg:items-center text-xs top-[4.5rem] left-[17.4rem] hover:w-[1.6rem] hover:h-[1.6rem] hover:top-[4rem] duration-150 text-center 
        "
      >
        5
      </button>

      <button
        type="button"
        onClick={() => setShowSix(true)}
        className="absolute bg-MainGreen-300 text-white rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem] lg:text-3xl lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:hover:flex lg:hover:justify-center lg:hover:pr-[0.5rem] lg:duration-150 
        w-[1.3rem] h-[1.3rem] lg:flex lg:items-center text-xs top-[9.6rem] left-[2.2rem] hover:w-[1.6rem] hover:h-[1.6rem] hover:left-[2rem] hover:top-[9.6rem] duration-150 text-center
        "
      >
        6
      </button>
      <button
        type="button"
        onClick={() => setShowSeven(true)}
        className="absolute bg-MainGreen-300 text-white rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem] lg:text-3xl lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:hover:flex lg:hover:justify-center lg:hover:pr-[0.5rem] lg:duration-150 
        w-[1.3rem] h-[1.3rem] lg:flex lg:items-center text-xs top-[9.6rem] left-[4.6rem] hover:w-[1.6rem] hover:h-[1.6rem] hover:left-[4.4rem] hover:top-[9.6rem]  duration-150 text-center 
        "
      >
        7
      </button>
      <button
        type="button"
        onClick={() => setShowEight(true)}
        className="absolute bg-MainGreen-300 text-white rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem] lg:text-3xl lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:hover:flex lg:hover:justify-center lg:hover:pr-[0.5rem] lg:duration-150 
        w-[1.3rem] h-[1.3rem] lg:flex lg:items-center text-xs top-[9.6rem] left-[9rem] hover:w-[1.6rem] hover:h-[1.6rem] hover:top-[9.6rem] duration-150 text-center  
        "
      >
        8
      </button>
      <button
        type="button"
        onClick={() => setShowNine(true)}
        className="absolute bg-MainGreen-300 text-white rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem] lg:text-3xl lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:hover:flex lg:hover:justify-center lg:hover:pr-[0.5rem] lg:duration-150 
        w-[1.3rem] h-[1.3rem] lg:flex lg:items-center text-xs top-[10rem] left-[16.5rem] hover:w-[1.6rem] hover:h-[1.6rem] hover:top-[10rem] hover:left-[16.2rem] duration-150 text-center 
        "
      >
        9
      </button>
      <img src="../carDrawings/vanPlantegning.png" alt="kangoo" />
    </div>
  );
};
export default VanDrawing;
