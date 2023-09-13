import { NextRouter, useRouter } from "next/router";
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";

interface BackButtonProps {
  pageName: string;
}

const BackButton = ({ pageName }: BackButtonProps) => {
  const [allowClick, setAllowClick] = useState(true);
  const router = useRouter();

  const handleBack = () => {
    setAllowClick(false);
    router.push(pageName);
  };

  return (
    <button
      disabled={!allowClick}
      type="button"
      onClick={handleBack}
      className="text-white bg-MainGreen-300 w-full h-full rounded-full"
    >
      <FontAwesomeIcon icon={faArrowLeftLong} className="text-xl w-full" />
    </button>
  );
};

export default BackButton;
