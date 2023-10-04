import { useEffect, useState } from "react";
import DamagePopUp from "../popups/damagePopUp";

interface vanDrawingProps {
  damages: {
    position: string | null;
    description: string | null;
    images: string[];
  }[];
  setDamages: (
    damages: {
      position: string | null;
      description: string | null;
      images: string[];
    }[]
  ) => void;
}

const VanDrawing = ({ damages, setDamages }: vanDrawingProps) => {
  const [showOne, setShowOne] = useState(false);
  const [showTwo, setShowTwo] = useState(false);
  const [showThree, setShowThree] = useState(false);
  const [showFour, setShowFour] = useState(false);
  const [showFive, setShowFive] = useState(false);
  const [showSix, setShowSix] = useState(false);
  const [showSeven, setShowSeven] = useState(false);
  const [showEight, setShowEight] = useState(false);
  const [showNine, setShowNine] = useState(false);

  const [damageOne, setDamageOne] = useState<{
    position: string | null;
    description: string | null;
    images: string[];
  } | null>(damages[0]);
  const [damageTwo, setDamageTwo] = useState<{
    position: string | null;
    description: string | null;
    images: string[];
  } | null>(damages[1] || null);
  const [damageThree, setDamageThree] = useState<{
    position: string | null;
    description: string | null;
    images: string[];
  } | null>(damages[2] || null);
  const [damageFour, setDamageFour] = useState<{
    position: string | null;
    description: string | null;
    images: string[];
  } | null>(damages[3] || null);
  const [damageFive, setDamageFive] = useState<{
    position: string | null;
    description: string | null;
    images: string[];
  } | null>(damages[4] || null);
  const [damageSix, setDamageSix] = useState<{
    position: string | null;
    description: string | null;
    images: string[];
  } | null>(damages[5] || null);
  const [damageSeven, setDamageSeven] = useState<{
    position: string | null;
    description: string | null;
    images: string[];
  } | null>(damages[6] || null);
  const [damageEight, setDamageEight] = useState<{
    position: string | null;
    description: string | null;
    images: string[];
  } | null>(damages[7] || null);
  const [damageNine, setDamageNine] =
    useState<{
      position: string | null;
      description: string | null;
      images: string[];
    } | null>(damages[8]) || null;

  useEffect(() => {
    const setFunctions = [
      setDamageOne,
      setDamageTwo,
      setDamageThree,
      setDamageFour,
      setDamageFive,
      setDamageSix,
      setDamageSeven,
      setDamageEight,
      setDamageNine,
    ];
    const positions = [
      "Front left wheel",
      "Front left door",
      "Rear left door",
      "Back left wheel",
      "Front bumper",
      "Hood",
      "Windshield",
      "Roof",
      "Back door",
    ];

    setFunctions.map((setFunction) => {
      setFunction(null);
    });

    damages.map((damage, index) => {
      if (!damage.position) {
        return;
      }

      const setFunctionIndex = positions.indexOf(damage.position);

      if (positions[setFunctionIndex] === damage.position) {
        setFunctions[setFunctionIndex](damage);
      }
    });
  }, [damages]);

  useEffect(() => {
    const newDamageArray: {
      position: string | null;
      description: string | null;
      images: string[];
    }[] = [];
    if (damageOne) {
      newDamageArray.push(damageOne);
    }
    if (damageTwo) {
      newDamageArray.push(damageTwo);
    }
    if (damageThree) {
      newDamageArray.push(damageThree);
    }
    if (damageFour) {
      newDamageArray.push(damageFour);
    }
    if (damageFive) {
      newDamageArray.push(damageFive);
    }
    if (damageSix) {
      newDamageArray.push(damageSix);
    }
    if (damageSeven) {
      newDamageArray.push(damageSeven);
    }
    if (damageEight) {
      newDamageArray.push(damageEight);
    }
    if (damageNine) {
      newDamageArray.push(damageNine);
    }
    setDamages(newDamageArray);
  }, [
    damageOne,
    damageTwo,
    damageThree,
    damageFour,
    damageFive,
    damageSix,
    damageSeven,
    damageEight,
    damageNine,
  ]);

  return (
    <div className="w-[22rem] md:w-[40rem] relative">
      <button
        type="button"
        onClick={() => setShowOne(true)}
        className="absolute bg-MainGreen-300 text-white rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem] lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:duration-150 
        w-[1.3rem] h-[1.3rem] md:text-2xl md:flex md:items-center md:justify-center md:top-[3.55rem] md:left-[-6.15rem] md:hover:top-[3.5rem] md:hover:left-[-6.15rem] text-xs top-[5.02rem] left-[3.03rem] hover:w-[1.6rem] hover:h-[1.6rem] hover:left-[2.88rem] hover:top-[4.87rem]  duration-150 text-center  
        "
      >
        1
      </button>
      <button
        type="button"
        onClick={() => setShowTwo(true)}
        className="absolute bg-MainGreen-300 text-white rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem]  lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:duration-150 
        w-[1.3rem] h-[1.3rem] md:text-2xl md:flex md:items-center md:justify-center md:top-[1rem] md:left-[0rem] md:hover:top-[1rem] md:hover:left-[0rem] text-xs top-[4rem] left-[6.3rem] hover:w-[1.6rem] hover:h-[1.6rem] hover:top-[3.7rem]  duration-150 text-center 
        "
      >
        2
      </button>
      <button
        type="button"
        onClick={() => setShowThree(true)}
        className="absolute bg-MainGreen-300 text-white rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem]  lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:duration-150 
        w-[1.3rem] h-[1.3rem] md:text-2xl md:flex md:items-center md:justify-center md:top-[-1.6rem] md:left-[5.2rem] md:hover:top-[-1.6rem] md:hover:left-[5.2rem] text-xs top-[2rem] left-[9.2rem] hover:w-[1.6rem] hover:h-[1.6rem] hover:top-[2rem] duration-150 text-center
        "
      >
        3
      </button>
      <button
        type="button"
        onClick={() => setShowFour(true)}
        className="absolute bg-MainGreen-300 text-white rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem]  lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:duration-150 
        w-[1.3rem] h-[1.3rem] md:text-2xl md:flex md:items-center md:justify-center md:top-[3.55rem] md:left-[8.35rem] md:hover:top-[3.5rem] md:hover:left-[8.35rem] text-xs top-[5.02rem] left-[11.18rem] hover:w-[1.6rem] hover:h-[1.6rem] hover:left-[11.02rem] hover:top-[4.88rem] duration-150 text-center
        "
      >
        4
      </button>
      <button
        type="button"
        onClick={() => setShowFive(true)}
        className="absolute bg-MainGreen-300 text-white rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem]  lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem]  lg:duration-150 
        w-[1.3rem] h-[1.3rem] md:text-2xl md:flex md:items-center md:justify-center md:top-[2.5rem] md:left-[19.3rem] md:hover:top-[2.5rem] md:hover:left-[19.3rem] text-xs top-[4.5rem] left-[17.4rem] hover:w-[1.6rem] hover:h-[1.6rem] hover:top-[4rem] duration-150 text-center 
        "
      >
        5
      </button>

      <button
        type="button"
        onClick={() => setShowSix(true)}
        className="absolute bg-MainGreen-300 text-white rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem]  lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem]  lg:duration-150 
        w-[1.3rem] h-[1.3rem] md:text-2xl md:flex md:items-center md:justify-center md:top-[11.8rem] md:left-[-7.5rem] md:hover:top-[11.8rem] md:hover:left-[-7.5rem] text-xs top-[9.6rem] left-[2.2rem] hover:w-[1.6rem] hover:h-[1.6rem] hover:left-[2rem] hover:top-[9.6rem] duration-150 text-center
        "
      >
        6
      </button>
      <button
        type="button"
        onClick={() => setShowSeven(true)}
        className="absolute bg-MainGreen-300 text-white rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem]  lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:duration-150 
        w-[1.3rem] h-[1.3rem] md:text-2xl md:flex md:items-center md:justify-center md:top-[11.8rem] md:left-[-3.4rem] md:hover:top-[11.8rem] md:hover:left-[-3.4rem] text-xs top-[9.6rem] left-[4.6rem] hover:w-[1.6rem] hover:h-[1.6rem] hover:left-[4.4rem] hover:top-[9.6rem]  duration-150 text-center 
        "
      >
        7
      </button>
      <button
        type="button"
        onClick={() => setShowEight(true)}
        className="absolute bg-MainGreen-300 text-white rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem]  lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:duration-150 
        w-[1.3rem] h-[1.3rem] md:text-2xl md:flex md:items-center md:justify-center md:top-[11.8rem] md:left-[4.5rem] md:hover:top-[11.8rem] md:hover:left-[4.5rem] text-xs top-[9.6rem] left-[9rem] hover:w-[1.6rem] hover:h-[1.6rem] hover:top-[9.6rem] duration-150 text-center  
        "
      >
        8
      </button>
      <button
        type="button"
        onClick={() => setShowNine(true)}
        className="absolute bg-MainGreen-300 text-white rounded-full border-[2px] lg:h-8 lg:w-8 border-MainGreen-300 lg:mt-[5.55rem]  lg:ml-[11.7rem] lg:hover:ml-[11.56rem] lg:hover:w-9 lg:hover:h-9 lg:hover:mt-[5.45rem] lg:duration-150 
        w-[1.3rem] h-[1.3rem] md:text-2xl md:flex md:items-center md:justify-center md:top-[12.4rem] md:left-[18rem] md:hover:top-[12.4rem] md:hover:left-[18rem] text-xs top-[10rem] left-[16.5rem] hover:w-[1.6rem] hover:h-[1.6rem] hover:top-[10rem] hover:left-[16.2rem] duration-150 text-center 
        "
      >
        9
      </button>
      <img src="../carDrawings/vanPlantegning.png" alt="kangoo" />

      {showOne && (
        <DamagePopUp
          position="Front left wheel"
          setShowPopUp={setShowOne}
          damage={damageOne}
          setDamage={setDamageOne}
        />
      )}
      {showTwo && (
        <DamagePopUp
          position="Front left door"
          setShowPopUp={setShowTwo}
          damage={damageTwo}
          setDamage={setDamageTwo}
        />
      )}
      {showThree && (
        <DamagePopUp
          position="Rear left door"
          setShowPopUp={setShowThree}
          damage={damageThree}
          setDamage={setDamageThree}
        />
      )}
      {showFour && (
        <DamagePopUp
          position="Back left wheel"
          setShowPopUp={setShowFour}
          damage={damageFour}
          setDamage={setDamageFour}
        />
      )}
      {showFive && (
        <DamagePopUp
          position="Front bumper"
          setShowPopUp={setShowFive}
          damage={damageFive}
          setDamage={setDamageFive}
        />
      )}
      {showSix && (
        <DamagePopUp
          position="Hood"
          setShowPopUp={setShowSix}
          damage={damageSix}
          setDamage={setDamageSix}
        />
      )}
      {showSeven && (
        <DamagePopUp
          position="Windshield"
          setShowPopUp={setShowSeven}
          damage={damageSeven}
          setDamage={setDamageSeven}
        />
      )}
      {showEight && (
        <DamagePopUp
          position="Roof"
          setShowPopUp={setShowEight}
          damage={damageEight}
          setDamage={setDamageEight}
        />
      )}
      {showNine && (
        <DamagePopUp
          position="Back door"
          setShowPopUp={setShowNine}
          damage={damageNine}
          setDamage={setDamageNine}
        />
      )}
    </div>
  );
};
export default VanDrawing;
