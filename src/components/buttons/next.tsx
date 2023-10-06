import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

interface NextButtonProps {
  disabled: boolean;
}

const NextButton = ({ disabled }: NextButtonProps) => {
  const [loading, setLoading] = useState(disabled);

  useEffect(() => {
    setLoading(disabled);
  }, [disabled]);


  return (
    <button
      disabled={disabled}
      type="submit"
      className="text-white w-full bg-MainGreen-300 disabled:bg-MainGreen-200 h-full rounded-full flex justify-center items-center"
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
