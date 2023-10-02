import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

interface NextButtonProps {
  allowClick: boolean;
}

const NextButton = ({ allowClick }: NextButtonProps) => {
  const [loading, setLoading] = useState(allowClick);

  useEffect(() => {
    setLoading(!allowClick);
  }, [allowClick]);
  return (
    <button
      disabled={!allowClick}
      type="submit"
      className="text-white w-full bg-MainGreen-300 h-full rounded-full flex justify-center items-center"
    >
      {!loading ? (
        <FontAwesomeIcon icon={faArrowRightLong} className="w-full text-xl" />
      ) : (
        <FontAwesomeIcon icon={faSpinner} spin />
      )}
    </button>
  );
};

export default NextButton;
