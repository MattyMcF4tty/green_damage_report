import { NextRouter, useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";

interface BackButtonProps {
  pageName: string;
}

const BackButton = ({ pageName }: BackButtonProps) => {
  const router = useRouter();

  const handleBack = () => {
    router.push(pageName);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="text-white bg-MainGreen-300 w-full h-full rounded-full"
    >
      <FontAwesomeIcon icon={faArrowLeftLong} className="text-xl w-full" />
    </button>
  );
};

export default BackButton;
