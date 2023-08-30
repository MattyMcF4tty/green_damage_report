import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

const NextButton = () => {
  return (
    <div className="w-full h-full">
      <button
        type="submit"
        className="text-white w-full bg-MainGreen-300 h-full rounded-full"
      >
        <FontAwesomeIcon icon={faArrowRightLong} className="w-full text-xl" />
      </button>
    </div>
  );
};

export default NextButton;
