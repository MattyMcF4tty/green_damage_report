import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

interface NextButtonProps {
  allowClick: boolean;
}

const NextButton = ({ allowClick }: NextButtonProps) => {
  return (
    <div className="w-full h-full">
      <button
        disabled={!allowClick}
        type="submit"
        className="text-white w-full bg-MainGreen-300 h-full rounded-full flex items-center"
      >
        <FontAwesomeIcon icon={faArrowRightLong} className="w-full text-xl" />
      </button>
    </div>
  );
};

export default NextButton;
