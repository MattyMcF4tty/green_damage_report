import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

const NextButton = () => {
  return (
    <div>
      <button
        type="submit"
        className="text-white bg-MainGreen-300 h-full rounded-full"
      >
        <FontAwesomeIcon icon={faArrowRightLong} className="w-full text-xl" />
      </button>
    </div>
  );
};

export default NextButton;
