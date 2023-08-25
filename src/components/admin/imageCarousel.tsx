import {
  faCircleArrowLeft,
  faCircleArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import react, { useState } from "react";

interface ImageCarouselProps {
  images: string[];
  allowPopUp: boolean;
  imageIndex?: number;
  setImageIndex?: (index: number) => void;
}

const ImageCarousel = ({
  images,
  allowPopUp,
  imageIndex,
  setImageIndex,
}: ImageCarouselProps) => {
  if (images.length <= 0) {
    return <div>No Images</div>;
  }
  const [showButtons, setShowButtons] = useState(false);
  const [showImages, setShowImages] = useState(false);

  const [localImageIndex, setLocalImageIndex] = useState<number>(0);

  const handlePrevImage = (
    imageIndex: number,
    setImageIndex: (index: number) => void
  ) => {
    if (imageIndex <= images.length - 1 && imageIndex !== 0) {
      setImageIndex(imageIndex - 1);
    } else {
      setImageIndex(images.length - 1);
    }
  };

  const handleNextImage = (
    imageIndex: number,
    setImageIndex: (index: number) => void
  ) => {
    if (imageIndex < images.length - 1) {
      setImageIndex(imageIndex + 1);
    } else {
      setImageIndex(0);
    }
  };

  if (imageIndex && setImageIndex) {
    return (
      <div
        className="flex flex-row w-full relative on"
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
      >
        <img
          className={`w-[full] `}
          src={images[imageIndex]}
          alt={`image${imageIndex}`}
          onClick={() => setShowImages(true)}
        />

        <button
          type="button"
          onClick={() => handlePrevImage(imageIndex, setImageIndex)}
          className={`z-20 absolute left-0 top-1/2 text-MainGreen-300 text-3xl transition-opacity pl-2 ${
            showButtons ? "opacity-100 " : "opacity-0"
          }`}
        >
          <FontAwesomeIcon
            className="bg-white rounded-full"
            icon={faCircleArrowLeft}
          />
        </button>

        <button
          type="button"
          onClick={() => handleNextImage(imageIndex, setImageIndex)}
          className={`z-20 absolute right-0 top-1/2 text-MainGreen-300 text-3xl transition-opacity pr-2 ${
            showButtons ? "opacity-100 " : "opacity-0"
          }`}
        >
          <FontAwesomeIcon
            className="bg-white rounded-full"
            icon={faCircleArrowRight}
          />
        </button>

        {showImages && allowPopUp && (
          <ImagesFullScreen
            imageIndex={imageIndex}
            setImageIndex={setImageIndex}
            images={images}
            setVisibility={setShowImages}
          />
        )}
      </div>
    );
  } else {
    return (
      <div
        className="flex flex-row w-full relative on"
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
      >
        <img
          className={`w-[full] `}
          src={images[localImageIndex]}
          alt={`image${localImageIndex}`}
          onClick={() => setShowImages(true)}
        />

        <button
          type="button"
          onClick={() => handlePrevImage(localImageIndex, setLocalImageIndex)}
          className={`z-20 absolute left-0 top-1/2 text-MainGreen-300 text-3xl transition-opacity pl-2 ${
            showButtons ? "opacity-100 " : "opacity-0"
          }`}
        >
          <FontAwesomeIcon
            className="bg-white rounded-full"
            icon={faCircleArrowLeft}
          />
        </button>

        <button
          type="button"
          onClick={() => handleNextImage(localImageIndex, setLocalImageIndex)}
          className={`z-20 absolute right-0 top-1/2 text-MainGreen-300 text-3xl transition-opacity pr-2 ${
            showButtons ? "opacity-100 " : "opacity-0"
          }`}
        >
          <FontAwesomeIcon
            className="bg-white rounded-full"
            icon={faCircleArrowRight}
          />
        </button>

        {showImages && allowPopUp && (
          <ImagesFullScreen
            imageIndex={localImageIndex}
            setImageIndex={setLocalImageIndex}
            images={images}
            setVisibility={setShowImages}
          />
        )}
      </div>
    );
  }
};

export default ImageCarousel;

interface ImagesFullScreenProps {
  images: string[];
  setVisibility: (visiblity: boolean) => void;
  imageIndex: number;
  setImageIndex: (index: number) => void;
}

const ImagesFullScreen = ({
  images,
  setVisibility,
  imageIndex,
  setImageIndex,
}: ImagesFullScreenProps) => {
  const [noLeave, setNoLeave] = useState(false);

  return (
    <div
      className="fixed flex h-full justify-center items-center z-20 inset-0 bg-black bg-opacity-75 overflow-y-auto "
      onClick={() => {
        if (noLeave) {
          setVisibility(false);
        }
      }}
    >
      <div
        className="w-1/3 z-30"
        onMouseEnter={() => setNoLeave(false)}
        onMouseLeave={() => setNoLeave(true)}
      >
        <ImageCarousel
          imageIndex={imageIndex}
          setImageIndex={setImageIndex}
          allowPopUp={false}
          images={images}
        />
      </div>
    </div>
  );
};
