import { useEffect, useState } from "react";
import BikeInfoForm, {
  bikeInformation,
} from "../opposite_information/bike_information_form";
import CarInfoForm, {
  carInformation,
} from "../opposite_information/car_information_form";
import OtherInfoForm, {
  OtherInformation,
} from "../opposite_information/other_information_form";
import PedestrianInfoForm, {
  PedestrianInformation,
} from "../opposite_information/person_information_form";
import { Checkbox } from "../custom_inputfields";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBicycle,
  faBox,
  faCar,
  faPerson,
  faX,
} from "@fortawesome/free-solid-svg-icons";

interface OtherPartyListProps {
  bikeValue: bikeInformation[];
  setBikeValue: (newBikeValue: bikeInformation[]) => void;

  vehicleValue: carInformation[];
  setVehicleValue: (newVehicleValue: carInformation[]) => void;

  pedestrianValue: PedestrianInformation[];
  setPedestrianValue: (newPedestrianValue: PedestrianInformation[]) => void;

  otherInfoValue: OtherInformation[];
  setOtherInfoValue: (newOtherInfoValue: OtherInformation[]) => void;
}

export const OtherPartyList = ({
  bikeValue,
  setBikeValue,
  vehicleValue,
  setVehicleValue,
  pedestrianValue,
  setPedestrianValue,
  otherInfoValue,
  setOtherInfoValue,
}: OtherPartyListProps) => {
  const [showPopUp, setShowPopUp] = useState<boolean>(false);

  const [updateBike, setUpdateBike] = useState<boolean>(false);
  const [bikeIndex, setBikeIndex] = useState<number>(0);

  const [updateVehicle, setUpdateVehicle] = useState<boolean>(false);
  const [vehicleIndex, setVehicleIndex] = useState<number>(0);

  const [updatePedestrian, setUpdatePedestrian] = useState<boolean>(false);
  const [pedestrianIndex, setPedestrianIndex] = useState<number>(0);

  const [updateOther, setUpdateOther] = useState<boolean>(false);
  const [otherIndex, setOtherIndex] = useState<number>(0);

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setShowPopUp(true)}
        className="w-32 h-10 bg-MainGreen-300 text-white rounded-md mb-2"
      >
        Add object
      </button>
      <div className="w-full">
        {/* Bike list */}
        {bikeValue.map((currentBike, index) => (
          <div
            key={index}
            onClick={() => {
              setUpdateBike(true);
              setBikeIndex(index);
            }}
            className="bg-MainGreen-100 flex flex-row items-center p-1 mb-1"
          >
            <FontAwesomeIcon icon={faBicycle} className="w-6 mr-2" />
            <div className="flex flex-row w-full">
              <div className="flex flex-col w-1/2">
                <p className="text-xs italic">Name</p>
                {currentBike.name ? currentBike.name : "-"}
              </div>
              <div className="flex flex-col w-1/2">
                <p className="text-xs italic">Phone</p>
                <p className="">
                  {currentBike.phone ? currentBike.phone : "-"}
                </p>
              </div>
            </div>
          </div>
        ))}
        {/* Vehicle list */}
        {vehicleValue.map((currentVehicle, index) => (
          <div
            key={index}
            onClick={() => {
              setUpdateVehicle(true);
              setVehicleIndex(index);
            }}
            className="bg-MainGreen-100 flex flex-row items-center p-1 mb-1"
          >
            <FontAwesomeIcon icon={faCar} className="w-6 mr-2" />
            <div className="flex flex-row w-full">
              <div className="flex flex-col w-1/2">
                <p className="text-xs italic">Name</p>
                <p className="">
                  {currentVehicle.name ? currentVehicle.name : "-"}
                </p>
              </div>
              <div className="flex flex-col w-1/2">
                <p className="text-xs italic">Phone</p>
                <p className="">
                  {currentVehicle.phone ? currentVehicle.phone : "-"}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Pedestrian list */}
        {pedestrianValue.map((currentPedestrian, index) => (
          <div
            key={index}
            onClick={() => {
              setUpdatePedestrian(true);
              setPedestrianIndex(index);
            }}
            className="bg-MainGreen-100 flex flex-row items-center p-1 mb-1"
          >
            <FontAwesomeIcon icon={faPerson} className="w-6 mr-2" />
            <div className="flex flex-row w-full">
              <div className="flex flex-col w-1/2 ">
                <p className="text-xs italic">Name</p>
                <p className="break-words text-sm mr-2">
                  {currentPedestrian.name ? currentPedestrian.name : "-"}
                </p>
              </div>
              <div className="flex flex-col w-1/2">
                <p className="text-xs italic">Phone</p>
                <p className="">
                  {currentPedestrian.phone ? currentPedestrian.phone : "-"}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Other list */}
        {otherInfoValue.map((currentOther, index) => (
          <div
            key={index}
            onClick={() => {
              setUpdateOther(true);
              setOtherIndex(index);
            }}
            className="bg-MainGreen-100 flex flex-row items-center p-1 mb-1"
          >
            <FontAwesomeIcon icon={faBox} className="w-6 mr-2" />
            <div className="flex flex-row w-full">
              <div className="flex flex-col w-1/2">
                <p className="text-xs italic">Description</p>
                <p className="text-xs break-words mr-4">
                  {currentOther.description ? currentOther.description : "-"}
                </p>
              </div>
              <div className="flex flex-col w-1/2">
                <p className="text-xs italic">Info</p>
                <p className="text-xs break-words mr-6">
                  {currentOther.information ? currentOther.information : "-"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showPopUp && (
        <NewObjectPopUp
          setVisibility={setShowPopUp}
          vehicleValue={
            new carInformation("", "", "", "", "", "", "")
          }
          setVehicleValue={(newVehicleValue) =>
            setVehicleValue([...vehicleValue, newVehicleValue])
          }
          bikeValue={
            new bikeInformation("", "", "", null, "")
          }
          setBikeValue={(newBikeValue) =>
            setBikeValue([...bikeValue, newBikeValue])
          }
          pedestrianValue={
            new PedestrianInformation("", "", "", "")
          }
          setPedestrianValue={(newPedestrianValue) =>
            setPedestrianValue([...pedestrianValue, newPedestrianValue])
          }
          otherValue={new OtherInformation("", "")}
          setOtherValue={(newOtherValue) =>
            setOtherInfoValue([...otherInfoValue, newOtherValue])
          }
        />
      )}
      {updateBike && (
        <UpdateBike
          index={bikeIndex}
          setBikeValue={setBikeValue}
          bikeValue={bikeValue}
          setVisibility={setUpdateBike}
        />
      )}
      {updateVehicle && (
        <UpdateVehicle
          index={vehicleIndex}
          setVehicleValue={setVehicleValue}
          vehicleValue={vehicleValue}
          setVisibility={setUpdateVehicle}
        />
      )}

      {updatePedestrian && (
        <UpdatePedestrian
          index={pedestrianIndex}
          setPedestrianValue={setPedestrianValue}
          pedestrianValue={pedestrianValue}
          setVisibility={setUpdatePedestrian}
        />
      )}

      {updateOther && (
        <UpdateOther
          index={otherIndex}
          setOtherValue={setOtherInfoValue}
          otherValue={otherInfoValue}
          setVisibility={setUpdateOther}
        />
      )}
    </div>
  );
};

/* ------------------ New obejct popup -------------------------------------------------------- */
interface NewObjectPopUpProps {
  setVisibility: (visibility: boolean) => void;

  bikeValue: bikeInformation;
  setBikeValue: (newBikeValue: bikeInformation) => void;

  vehicleValue: carInformation;
  setVehicleValue: (newVehicleValue: carInformation) => void;

  pedestrianValue: PedestrianInformation;
  setPedestrianValue: (newPedestrianValue: PedestrianInformation) => void;

  otherValue: OtherInformation;
  setOtherValue: (newOtherValue: OtherInformation) => void;
}

const NewObjectPopUp = ({
  setVisibility,
  bikeValue,
  setBikeValue,
  vehicleValue,
  setVehicleValue,
  pedestrianValue,
  setPedestrianValue,
  otherValue,
  setOtherValue,
}: NewObjectPopUpProps) => {
  const [isBike, setIsBike] = useState<boolean>(false);
  const [isVehicle, setIsVehicle] = useState<boolean>(false);
  const [isPedestrian, setIsPedestrian] = useState<boolean>(false);
  const [isOther, setIsOther] = useState<boolean>(false);

  const [currentBikeValue, setCurrentBikeValue] = useState<bikeInformation>(
    bikeValue ||
      new bikeInformation("", "", "", null, "")
  );
  const [currentVehicleValue, setCurrentVehicleValue] =
    useState<carInformation>(
      vehicleValue ||
        new carInformation("", "", "", "", "", "", "")
    );
  const [currentPedestrianValue, setCurrentPedestranValue] =
    useState<PedestrianInformation>(
      pedestrianValue ||
        new PedestrianInformation("", "", "", "")
    );
  const [currentOtherValue, setCurrentOtherValue] = useState<OtherInformation>(
    otherValue || new OtherInformation("", "")
  );

  const handleSave = () => {
    if (isBike) {
      setBikeValue(currentBikeValue);
    } else if (isVehicle) {
      setVehicleValue(currentVehicleValue);
    } else if (isPedestrian) {
      setPedestrianValue(currentPedestrianValue);
    } else if (isOther) {
      setOtherValue(currentOtherValue);
    }
    setVisibility(false);
  };

  const handleIsBike = (checked: boolean) => {
    setIsVehicle(false);
    setIsPedestrian(false);
    setIsOther(false);
    setIsBike(checked);
  };

  const handleIsOther = (checked: boolean) => {
    setIsBike(false);
    setIsVehicle(false);
    setIsPedestrian(false);
    setIsOther(checked);
  };

  const handleIsPedstrian = (checked: boolean) => {
    setIsBike(false);
    setIsVehicle(false);
    setIsOther(false);
    setIsPedestrian(checked);
  };

  const handleIsVehicle = (checked: boolean) => {
    setIsBike(false);
    setIsPedestrian(false);
    setIsOther(false);
    setIsVehicle(checked);
  };

  return (
    <div className="fixed flex justify-center items-center z-20 inset-0 bg-black bg-opacity-75 overflow-auto">
      <div className="bg-white p-2 flex flex-col rounded-md w-96 max-h-[40rem] overflow-y-auto">
        <p className="top-0 w-full text-center mb-4 border-b-[3px] border-MainGreen-300 ">
          Select one of the following
        </p>
        <div className="flex justify-evenly mb-2">
          <Checkbox
            labelText="Bike"
            id="isBike"
            value={isBike}
            onChange={(checked) => handleIsBike(checked)}
            requried={false}
          />

          <Checkbox
            labelText="Car"
            id="isVehicle"
            value={isVehicle}
            onChange={(checked) => handleIsVehicle(checked)}
            requried={false}
          />

          <Checkbox
            labelText="Pedestrian"
            id="isPedestrian"
            value={isPedestrian}
            onChange={(checked) => handleIsPedstrian(checked)}
            requried={false}
          />

          <Checkbox
            labelText="Other"
            id="isOther"
            value={isOther}
            onChange={(checked) => handleIsOther(checked)}
            requried={false}
          />
        </div>
        <div className="w-full overflow-x-hidden overflow-y-auto no-scrollbar">
          {!isBike && !isVehicle && !isPedestrian && !isOther && (
            <p className="w-full text-center mt-2">
              Select one of the following
            </p>
          )}
          {isBike && (
            <BikeInfoForm
              value={currentBikeValue}
              onChange={setCurrentBikeValue}
            />
          )}
          {isVehicle && (
            <CarInfoForm
              value={currentVehicleValue}
              onChange={setCurrentVehicleValue}
            />
          )}
          {isPedestrian && (
            <PedestrianInfoForm
              value={currentPedestrianValue}
              onChange={setCurrentPedestranValue}
            />
          )}
          {isOther && (
            <OtherInfoForm
              value={currentOtherValue}
              onChange={setCurrentOtherValue}
            />
          )}
        </div>
        <div className="flex flex-row w-full justify-evenly h-10">
          <button
            onClick={() => setVisibility(false)}
            className="bg-gray-300 w-1/4 hover:bg-red-600 h-full rounded-md hover:text-white"
          >
            Cancel
          </button>
          {(isBike || isVehicle || isPedestrian || isOther) && (
            <button
              onClick={() => handleSave()}
              className="bg-MainGreen-300 w-1/4 h-full text-white rounded-md"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* --------------------- UpdateBike -------------------------- */
interface UpdateBikeProps {
  index: number;
  setBikeValue: (updatedBikeValue: bikeInformation[]) => void;
  bikeValue: bikeInformation[];
  setVisibility: (visibility: boolean) => void;
}

const UpdateBike = ({
  index,
  setBikeValue,
  bikeValue,
  setVisibility,
}: UpdateBikeProps) => {
  const [currentBikeInfo, setCurrentBikeInfo] = useState<bikeInformation>(
    bikeValue[index]
  );

  const handleBikeUpdate = () => {
    const updatedBikeValue = bikeValue;
    updatedBikeValue[index] = currentBikeInfo;
    setBikeValue(updatedBikeValue);
    setVisibility(false);
  };

  const handleBikeDelete = () => {
    const updatedBikeValue = bikeValue;
    updatedBikeValue.splice(index, 1);
    setBikeValue(updatedBikeValue);
    setVisibility(false);
  };

  return (
    <div className="fixed flex justify-center items-center z-20 inset-0 bg-black bg-opacity-75 overflow-auto ">
      <div className="bg-white py-2 w-96 p-2 rounded-md max-h-[40rem] overflow-y-auto lg:w-1/3 lg:p-2 lg:h-full">
        <p className="mb-4 w-full text-center border-b-2 border-MainGreen-300 rounded-b-sm">
          Update Bike
        </p>
        <div className="">
          <BikeInfoForm
            value={bikeValue[index]}
            onChange={setCurrentBikeInfo}
          />
        </div>
        <div>
          <div className="flex flex-row w-full justify-evenly h-10">
            <button
              onClick={() => {
                handleBikeDelete();
                setVisibility(false);
              }}
              className="bg-gray-300 w-1/4 h-full rounded-md hover:bg-red-500 hover:text-white lg:mt-6"
            >
              Delete
            </button>
            <button
              onClick={() => handleBikeUpdate()}
              className="bg-MainGreen-300 w-1/4 text-white h-full rounded-md lg:mt-6"
            >
              Save
            </button>
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

/* --------------------- UpdateVehicle -------------------------- */
interface UpdateVehicleProps {
  index: number;
  setVehicleValue: (updatedVehicleValue: carInformation[]) => void;
  vehicleValue: carInformation[];
  setVisibility: (visibility: boolean) => void;
}

const UpdateVehicle = ({
  index,
  setVehicleValue,
  vehicleValue,
  setVisibility,
}: UpdateVehicleProps) => {
  const [currentVehicleInfo, setCurrentVehicleInfo] = useState<carInformation>(
    vehicleValue[index]
  );

  const handleVehicleUpdate = () => {
    const updatedVehicleValue = vehicleValue;
    updatedVehicleValue[index] = currentVehicleInfo;
    setVehicleValue(updatedVehicleValue);
    setVisibility(false);
  };

  const handleVehicleDelete = () => {
    const updatedVehicleValue = vehicleValue;
    updatedVehicleValue.splice(index, 1);
    setVehicleValue(updatedVehicleValue);
    setVisibility(false);
  };

  return (
    <div className="fixed flex justify-center items-center z-20 inset-0 bg-black bg-opacity-75 overflow-auto">
      <div className="bg-white py-2 w-96 p-2 rounded-md max-h-[40rem] overflow-x-hidden overflow-y-auto no-scrollbar lg:w-1/3 lg:p-2">
        <p className="mb-4 w-full text-center border-b-2 border-MainGreen-300 rounded-b-sm">
          Update Vehicle
        </p>
        <div className="">
          <CarInfoForm
            value={vehicleValue[index]}
            onChange={setCurrentVehicleInfo}
          />
        </div>
        <div>
          <div className="flex flex-row w-full justify-evenly h-10">
            <button
              onClick={() => handleVehicleDelete()}
              className="bg-red-500 w-1/4 rounded-md hover:bg-red-600 text-white"
            >
              Delete
            </button>
            <button
              onClick={() => handleVehicleUpdate()}
              className="bg-MainGreen-300 w-1/4 text-white rounded-md"
            >
              Save
            </button>
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

/* --------------------- UpdatePedestrian -------------------------- */
interface UpdatePedestrianProps {
  index: number;
  setPedestrianValue: (updatedPedestrianValue: PedestrianInformation[]) => void;
  pedestrianValue: PedestrianInformation[];
  setVisibility: (visibility: boolean) => void;
}

const UpdatePedestrian = ({
  index,
  setPedestrianValue,
  pedestrianValue,
  setVisibility,
}: UpdatePedestrianProps) => {
  const [currentPedestrianInfo, setCurrentPedestrianInfo] =
    useState<PedestrianInformation>(pedestrianValue[index]);

  const handlePedestrianUpdate = () => {
    const updatedPedestrianValue = pedestrianValue;
    updatedPedestrianValue[index] = currentPedestrianInfo;
    setPedestrianValue(updatedPedestrianValue);
    setVisibility(false);
  };

  const handlePedestrianDelete = () => {
    const updatedPedestrianValue = pedestrianValue;
    updatedPedestrianValue.splice(index, 1);
    setPedestrianValue(updatedPedestrianValue);
    setVisibility(false);
  };

  return (
    <div className="fixed flex justify-center items-center z-20 inset-0 bg-black bg-opacity-75 overflow-auto">
      <div className="bg-white py-2 w-96 p-2 rounded-md max-h-[40rem] overflow-y-auto lg:w-1/3 lg:p-2 lg:">
        <p className="mb-4 w-full text-center border-b-2 border-MainGreen-300 rounded-b-sm">
          Update Pedestrian
        </p>
        <div className="lg:flex lg:justify-evenly lg:">
          <PedestrianInfoForm
            value={pedestrianValue[index]}
            onChange={setCurrentPedestrianInfo}
          />
        </div>
        <div>
          <div className="flex flex-row w-full justify-evenly h-10 ">
            <button
              onClick={() => handlePedestrianDelete()}
              className="bg-red-500 w-1/4 rounded-md hover:bg-red-600 text-white"
            >
              Delete
            </button>
            <button
              onClick={() => handlePedestrianUpdate()}
              className="bg-MainGreen-300 w-1/4 text-white rounded-md"
            >
              Save
            </button>
          </div>{" "}
        </div>
      </div>
    </div>
  );
};
/* --------------------- UpdateOther -------------------------- */
interface UpdateOtherProps {
  index: number;
  setOtherValue: (updatedOtherValue: OtherInformation[]) => void;
  otherValue: OtherInformation[];
  setVisibility: (visibility: boolean) => void;
}

const UpdateOther = ({
  index,
  setOtherValue,
  otherValue,
  setVisibility,
}: UpdateOtherProps) => {
  const [currentOtherInfo, setCurrentOtherInfo] = useState<OtherInformation>(
    otherValue[index]
  );

  const handleOtherUpdate = () => {
    const updatedOtherValue = otherValue;
    updatedOtherValue[index] = currentOtherInfo;
    setOtherValue(updatedOtherValue);
    setVisibility(false);
  };

  const handleOtherDelete = () => {
    const updatedOtherValue = otherValue;
    updatedOtherValue.splice(index, 1);
    setOtherValue(updatedOtherValue);
    setVisibility(false);
  };

  return (
    <div className="fixed flex justify-center items-center z-20 inset-0 bg-black bg-opacity-75 overflow-auto">
      <div className="bg-white py-2 w-96 p-2 rounded-md max-h-[40rem] overflow-y-auto lg:w-1/3 lg:h-[25rem]">
        <p className="mb-4 w-full text-center border-b-2 border-MainGreen-300 rounded-b-sm">
          Update Other
        </p>
        <div className="">
          <OtherInfoForm
            value={otherValue[index]}
            onChange={setCurrentOtherInfo}
          />
        </div>
        <div>
          <div className="flex flex-row w-full justify-evenly h-10 lg:flex lg:">
            <button
              onClick={() => handleOtherDelete()}
              className="bg-red-500 w-1/4 rounded-md hover:bg-red-600 text-white"
            >
              Delete
            </button>
            <button
              onClick={() => handleOtherUpdate()}
              className={`bg-MainGreen-300 w-1/4 text-white rounded-md`}
            >
              Save
            </button>
          </div>{" "}
        </div>
      </div>
    </div>
  );
};
