import { useEffect, useState } from "react";

interface ZoeDrawingProps {
  setShowOne: (visible: boolean) => void;
  setShowTwo: (visible: boolean) => void;
  setShowThree: (visible: boolean) => void;
  setShowFour: (visible: boolean) => void;
  setShowFive: (visible: boolean) => void;
  setShowSix: (visible: boolean) => void;
  setShowSeven: (visible: boolean) => void;
  setShowEight: (visible: boolean) => void;
  setShowNine: (visible: boolean) => void;
  setShowTen: (visible: boolean) => void;
  setShowEleven: (visible: boolean) => void;
  setShowTwelve: (visible: boolean) => void;
  setShowThirteen: (visible: boolean) => void;
  setShowFourteen: (visible: boolean) => void;
  setShowFifteen: (visible: boolean) => void;
}

const ZoeDrawing = ({
  setShowOne,
  setShowTwo,
  setShowThree,
  setShowFour,
  setShowFive,
  setShowSix,
  setShowSeven,
  setShowEight,
  setShowNine,
  setShowTen,
  setShowEleven,
  setShowTwelve,
  setShowThirteen,
  setShowFourteen,
  setShowFifteen,
}: ZoeDrawingProps) => {
  return (
    <div className="w-[22rem] md:w-[40rem] relative">
      <button
        type="button"
        onClick={() => setShowOne(true)}
        className="absolute bg-MainGreen-300 text-white rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem] lg:text-2xl lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:hover:flex lg:hover:justify-center  lg:duration-150 
        w-[1.1rem] h-[1.1rem] md:flex md:items-center md:justify-center md:top-[0.03rem] md:left-[0.02rem] md:hover:left-[0.01rem] md:hover:top-[0.03rem] lg:flex lg:items-center text-xs top-[3.15rem] left-[6.58rem] hover:w-[1.4rem] hover:h-[1.4rem] hover:left-[6.43rem] hover:top-[3rem] duration-150 text-center 
        "
      >
        1
      </button>
      <button
        type="button"
        onClick={() => setShowTwo(true)}
        className="absolute bg-MainGreen-300 text-white text-xs rounded-full border-2 lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[4.3rem] lg:text-2xl lg:ml-[17rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[4.25rem] lg:duration-150 
        w-[1.1rem] h-[1.1rem] md:left-[0rem] md:top-[0.2rem] md:flex md:items-center md:justify-center md:hover:top-[0rem] md:hover:left-[0rem] top-[2.5rem] left-[9.5rem] hover:w-[1.4rem] hover:h-[1.4rem] hover:top-[2.3rem] duration-150 text-center 
        "
      >
        2
      </button>
      <button
        type="button"
        onClick={() => setShowThree(true)}
        className="absolute bg-MainGreen-300 text-white text-xs rounded-full border-2 lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[4.3rem] lg:text-2xl lg:ml-[21.5rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[4.25rem] lg:hover:flex lg:hover:justify-center lg:duration-150 
        w-[1.1rem] h-[1.1rem] md:flex md:items-center md:justify-center md:left-[-0.5rem] md:top-[0.2rem] md:hover:left-[-0.5rem] md:hover:top-[0rem] lg:[0.4rem] top-[2.5rem] left-[11.8rem] hover:w-[1.4rem] hover:h-[1.4rem] hover:top-[2.3rem] duration-150 text-center 
        "
      >
        3
      </button>
      <button
        type="button"
        onClick={() => setShowFour(true)}
        className="absolute bg-MainGreen-300 text-white text-xs rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem] lg:text-2xl lg:ml-[24.78rem] lg:hover:ml-[24.65rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:hover:flex lg:hover:justify-center  lg:duration-150 
        w-[1.1rem] h-[1.1rem] md:flex md:items-center md:justify-center md:left-[0rem] md:top-[0.05rem] md:hover:left-[0rem] md:hover:top-[0rem] top-[3.15rem] left-[13.94rem] hover:w-[1.4rem] hover:h-[1.4rem] hover:top-[3rem] hover:left-[13.8rem] duration-150 text-center
        "
      >
        4
      </button>
      <button
        type="button"
        onClick={() => setShowFive(true)}
        className="absolute bg-MainGreen-300 text-white text-xs rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem] lg:text-2xl lg:ml-[24.78rem] lg:hover:ml-[24.65rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:hover:flex lg:hover:justify-center  lg:duration-150 
        w-[1.1rem] h-[1.1rem] md:flex md:items-center md:justify-center md:left-[-23.2rem] md:top-[6rem] md:hover:left-[-23.2rem] md:hover:top-[6rem] top-[6.5rem] left-[1rem] hover:w-[1.4rem] hover:h-[1.4rem] hover:top-[6.5rem] duration-150 text-center 
        "
      >
        5
      </button>
      <button
        type="button"
        onClick={() => setShowSix(true)}
        className="absolute bg-MainGreen-300 text-white text-xs rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem] lg:text-2xl lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:hover:flex lg:hover:justify-center  lg:duration-150 
        w-[1.1rem] h-[1.1rem] md:flex md:items-center md:justify-center md:left-[-1rem] md:top-[6rem] md:hover:left-[-1rem] md:hover:top-[6rem] top-[6.5rem] left-[5.8rem] hover:w-[1.4rem] hover:h-[1.4rem] hover:top-[6.5rem] duration-150 text-center
        "
      >
        6
      </button>
      <button
        type="button"
        onClick={() => setShowSeven(true)}
        className="absolute bg-MainGreen-300 text-white text-xs rounded-full border-2 lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[4.3rem] lg:text-2xl lg:ml-[17rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[4.25rem] lg:duration-150 
        w-[1.1rem] h-[1.1rem] md:flex md:items-center md:justify-center md:left-[-2rem] md:top-[7.2rem] md:hover:left-[-2.1rem] md:hover:top-[7.2rem] top-[6.5rem] left-[8.3rem] hover:w-[1.4rem] hover:h-[1.4rem] hover:top-[6.5rem] duration-150 text-center
        "
      >
        7
      </button>
      <button
        type="button"
        onClick={() => setShowEight(true)}
        className="absolute bg-MainGreen-300 text-white text-xs rounded-full border-2 lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[4.3rem] lg:text-2xl lg:ml-[21.5rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[4.25rem] lg:hover:flex lg:hover:justify-center  lg:duration-150 
        w-[1.1rem] h-[1.1rem] md:flex md:items-center md:justify-center md:left-[-1rem] md:top-[7.2rem] md:hover:left-[-1rem] md:hover:top-[7.2rem] top-[6.5rem] left-[11.5rem] hover:w-[1.4rem] hover:h-[1.4rem] hover:top-[6.5rem] duration-150 text-center
        "
      >
        8
      </button>
      <button
        type="button"
        onClick={() => setShowNine(true)}
        className="absolute bg-MainGreen-300 text-white text-xs rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem] lg:text-2xl lg:ml-[24.78rem] lg:hover:ml-[24.65rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:hover:flex lg:hover:justify-center lg:duration-150 
        w-[1.1rem] h-[1.1rem] md:flex md:items-center md:justify-center md:left-[0.8rem] md:top-[6rem] md:hover:left-[0.8rem] md:hover:top-[6rem] top-[6.5rem] left-[14.4rem] hover:w-[1.4rem] hover:h-[1.4rem] hover:top-[6.5rem]  duration-150 text-center 
        "
      >
        9
      </button>
      <button
        type="button"
        onClick={() => setShowTen(true)}
        className="absolute bg-MainGreen-300 text-white text-xs rounded-full border-[2px]  border-MainGreen-300 lg:mt-[5.55rem] lg:ml-[24.78rem] lg:hover:ml-[24.65rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:hover:flex lg:hover:justify-center lg:duration-150 
        w-[1.1rem] h-[1.1rem] md:flex md:items-center md:justify-center md:w-[2rem] md:text-2xl md:h-[2rem]  md:left-[3.5rem] md:top-[6rem] md:hover:left-[3.5rem] md:hover:top-[6rem] top-[6.5rem] left-[15.9rem] hover:w-[1.4rem] hover:h-[1.4rem] hover:top-[6.5rem]  duration-150 text-center  
        "
      >
        10
      </button>
      <button
        type="button"
        onClick={() => setShowEleven(true)}
        className="absolute bg-MainGreen-300 text-white text-xs rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem] lg:text-2xl lg:ml-[24.78rem] lg:hover:ml-[24.65rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:hover:flex lg:hover:justify-center lg:duration-150 
        w-[1.1rem] h-[1.1rem] md:flex md:items-center md:justify-center md:left-[10rem] md:top-[6rem] md:hover:left-[10rem] md:hover:top-[6rem] top-[6.5rem] left-[19.6rem] hover:w-[1.4rem] hover:h-[1.4rem] hover:top-[6.5rem]  duration-150 text-center 
        "
      >
        11
      </button>
      <button
        type="button"
        onClick={() => setShowTwelve(true)}
        className="absolute bg-MainGreen-300 text-white rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem] lg:text-2xl lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:hover:flex lg:hover:justify-center lg:duration-150 
        w-[1.1rem] h-[1.1rem] md:flex md:items-center md:justify-center md:left-[0rem] md:top-[12.35rem] md:hover:left-[0.02rem] md:hover:top-[12.34rem] text-xs top-[10.07rem] left-[6.6rem] hover:w-[1.4rem] hover:h-[1.4rem] hover:left-[6.45rem] hover:top-[9.9rem]  duration-150 text-center  
        "
      >
        12
      </button>
      <button
        type="button"
        onClick={() => setShowThirteen(true)}
        className="absolute bg-MainGreen-300 text-white rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem] lg:text-2xl lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:hover:flex lg:hover:justify-center lg:duration-150 
        w-[1.1rem] h-[1.1rem] md:flex md:items-center md:justify-center md:left-[5.3rem] md:top-[13.5rem] md:hover:left-[5.3rem] md:hover:top-[13.6rem] text-xs top-[10.65rem] left-[9.7rem] hover:w-[1.4rem] hover:h-[1.4rem]  hover:top-[10.65rem] duration-150 text-center   
        "
      >
        13
      </button>
      <button
        type="button"
        onClick={() => setShowFourteen(true)}
        className="absolute bg-MainGreen-300 text-white rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem] lg:text-2xl lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:hover:flex lg:hover:justify-center lg:duration-150 
        w-[1.1rem] h-[1.1rem] md:flex md:items-center md:justify-center md:left-[9.5rem] md:top-[13.5rem] md:hover:left-[9.5rem] md:hover:top-[13.6rem] text-xs top-[10.65rem] left-[12rem] hover:w-[1.4rem] hover:h-[1.4rem]  hover:top-[10.65rem] duration-150 text-center   
        "
      >
        14
      </button>
      <button
        type="button"
        onClick={() => setShowFifteen(true)}
        className="absolute bg-MainGreen-300 text-white rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem] lg:text-2xl lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:hover:flex lg:hover:justify-center lg:duration-150 
        w-[1.1rem] h-[1.1rem] md:flex md:items-center md:justify-center md:left-[13.1rem] md:top-[12.35rem] md:hover:left-[13.12rem] md:hover:top-[12.3rem] text-xs top-[10.07rem] left-[13.95rem] hover:w-[1.4rem] hover:h-[1.4rem] hover:left-[13.8rem] hover:top-[9.9rem] duration-150 text-center   
        "
      >
        15
      </button>
      <img src="../carDrawings/zoePlantegning.png" alt="ZoeDrawing" />
    </div>
  );
};

export default ZoeDrawing;
