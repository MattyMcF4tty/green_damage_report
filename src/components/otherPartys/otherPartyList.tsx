import { useEffect, useState } from "react";
import BikeInfoForm, { bikeInformation } from "../opposite_information/bike_information_form";
import CarInfoForm, { carInformation } from "../opposite_information/car_information_form";
import OtherInfoForm, { OtherInformation } from "../opposite_information/other_information_form";
import PedestrianInfoForm, { PedestrianInformation } from "../opposite_information/person_information_form";
import { Checkbox } from "../custom_inputfields";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBicycle, faCar, faX } from "@fortawesome/free-solid-svg-icons";

interface OtherPartyListProps {
    bikeValue: bikeInformation[],
    setBikeValue: (newBikeValue: bikeInformation[]) => void,

    vehicleValue: carInformation[],
    setVehicleValue: (newVehicleValue: carInformation[]) => void,

    pedestrianValue: PedestrianInformation[],
    setPedestrianValue: (newPedestrianValue: PedestrianInformation[]) => void,

    otherInfoValue: OtherInformation[],
    setOtherInfoValue: (newOtherInfoValue: OtherInformation[]) => void,
}

export const OtherPartyList = ({bikeValue, setBikeValue, vehicleValue, setVehicleValue, pedestrianValue, setPedestrianValue, otherInfoValue, setOtherInfoValue}: OtherPartyListProps) => {
    const [showPopUp, setShowPopUp] = useState<boolean>(false);

    const [updateBike, setUpdateBike] = useState<boolean>(false);
    const [bikeIndex, setBikeIndex] = useState<number>(0);

    const [updateVehicle, setUpdateVehicle] = useState<boolean>(false);
    const [vehicleIndex, setVehicleIndex] = useState<number>(0);

    return (
        <div className="w-full">
            <button type="button" onClick={() => setShowPopUp(true)}
            className="w-32 h-10 bg-MainGreen-300 text-white rounded-md mb-2">
                Add object
            </button>
            <div className="w-full">
                {/* Bike list */}
                {bikeValue.map((currentBike, index) => (
                    <div key={index} onClick={() => {setUpdateBike(true); setBikeIndex(index)}}
                    className="bg-MainGreen-100 flex flex-row items-center p-1 mb-1">
                        <FontAwesomeIcon icon={faBicycle} 
                        className="w-6 mr-2"/>
                        <div className="flex flex-row w-full">
                            <div className="flex flex-col w-1/2">
                                <p className="text-xs">Name</p>
                                <p className="">{currentBike.name}</p>
                            </div>
                            <div className="flex flex-col w-1/2">
                                <p className="text-xs">Phone</p>
                                <p className="">{currentBike.phone ? currentBike.phone : "-"}</p>
                            </div>
                        </div>
                    </div>
                ))}
                {/* Vehicle list */}
                {vehicleValue.map((currentVehicle, index) => (
                    <div key={index} onClick={() => {setUpdateVehicle(true); setVehicleIndex(index)}}
                    className="bg-MainGreen-100 flex flex-row items-center p-1 mb-1">
                        <FontAwesomeIcon icon={faCar} 
                        className="w-6 mr-2"/>
                        <div className="flex flex-row w-full">
                            <div className="flex flex-col w-1/2">
                                <p className="text-xs">Name</p>
                                <p className="">{currentVehicle.name ? currentVehicle.name : "-"}</p>
                            </div>
                            <div className="flex flex-col w-1/2">
                                <p className="text-xs">Phone</p>
                                <p className="">{currentVehicle.phone ? currentVehicle.phone : "-"}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showPopUp && (
                <NewObjectPopUp
                    setVisibility={setShowPopUp}
                    vehicleValue={new carInformation("", "", "", "", "", "", "")}
                    setVehicleValue={(newVehicleValue) => setVehicleValue([...vehicleValue, newVehicleValue])}
                    bikeValue={new bikeInformation("", "", "", null, "")}
                    setBikeValue={(newBikeValue) => setBikeValue([...bikeValue, newBikeValue])}
                    pedestrianValue={new PedestrianInformation("", "", "", "")}
                    setPedestrianValue={(newPedestrianValue) => setPedestrianValue([...pedestrianValue, newPedestrianValue])}
                    otherValue={new OtherInformation("", "")}
                    setOtherValue={(newOtherValue) => setOtherInfoValue([...otherInfoValue, newOtherValue])}
                />
            )}
            {updateBike && (
                <UpdateBike index={bikeIndex} setBikeValue={setBikeValue} bikeValue={bikeValue} setVisibility={setUpdateBike}/>
            )}
            {updateVehicle && (
                <UpdateVehicle index={vehicleIndex} setVehicleValue={setVehicleValue} vehicleValue={vehicleValue} setVisibility={setUpdateVehicle}/>
            )}
        </div>
    )
}

/* ------------------ New obejct popup -------------------------------------------------------- */
interface NewObjectPopUpProps {
    setVisibility: (visibility: boolean) => void,

    bikeValue: bikeInformation,
    setBikeValue: (newBikeValue: bikeInformation) => void,

    vehicleValue: carInformation,
    setVehicleValue: (newVehicleValue: carInformation) => void,

    pedestrianValue: PedestrianInformation,
    setPedestrianValue: (newPedestrianValue: PedestrianInformation) => void,

    otherValue: OtherInformation,
    setOtherValue: (newOtherValue: OtherInformation) => void,
}

const NewObjectPopUp = ({setVisibility, bikeValue, setBikeValue, vehicleValue, setVehicleValue, pedestrianValue, setPedestrianValue, otherValue, setOtherValue}: NewObjectPopUpProps) => {    
    const [isBike, setIsBike] = useState<boolean>(false);
    const [isVehicle, setIsVehicle] = useState<boolean>(false);
    const [isPedestrian, setIsPedestrian] = useState<boolean>(false);
    const [isOther, setIsOther] = useState<boolean>(false);


    const [currentBikeValue, setCurrentBikeValue] = useState<bikeInformation>(bikeValue || new bikeInformation("", "", "", null,""));
    const [currentVehicleValue, setCurrentVehicleValue] = useState<carInformation>(vehicleValue || new carInformation("", "", "","", "","",""));
    const [currentPedestrianValue, setCurrentPedestranValue] = useState<PedestrianInformation>(pedestrianValue || new PedestrianInformation("","","",""));
    const [currentOtherValue, setCurrentOtherValue] = useState<OtherInformation>(otherValue || new OtherInformation("",""));

    const handleSave = () => {
        if (isBike) {
            setBikeValue(currentBikeValue);
        } else if (isVehicle) {
            setVehicleValue(currentVehicleValue)
        } else if (isPedestrian) {
            setPedestrianValue(currentPedestrianValue)
        } else if (isOther) {
            setOtherValue(currentOtherValue)
        }
        setVisibility(false);
    }

    const handleIsBike = (checked: boolean) => {
        setIsVehicle(false);
        setIsPedestrian(false);
        setIsOther(false);
        setIsBike(checked);
    }

    const handleIsOther = (checked: boolean) => {
        setIsBike(false);
        setIsVehicle(false);
        setIsPedestrian(false);
        setIsOther(checked)
    }

    const handleIsPedstrian =(checked: boolean) => {
        setIsBike(false);
        setIsVehicle(false);
        setIsOther(false);
        setIsPedestrian(checked)
    }

    const handleIsVehicle = (checked:boolean) => {
        setIsBike(false);
        setIsPedestrian(false);
        setIsOther(false);
        setIsVehicle(checked)
    };

    return (
        <div className="fixed flex justify-center items-center z-20 inset-0 bg-black bg-opacity-75 overflow-auto">
            <div className="bg-white p-2 flex flex-col rounded-md w-96 max-h-[40rem] overflow-y-auto">
                <p className="top-0 w-full text-center mb-4">New object</p>
                <div className="flex justify-evenly">
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
                <div className="w-full">
                    {(!isBike && !isVehicle && !isPedestrian && !isOther) && (
                    <p className="w-full text-center mt-2">
                        Select one of the following
                    </p>)}
                    {isBike && (<BikeInfoForm value={currentBikeValue} onChange={setCurrentBikeValue}/>)}
                    {isVehicle && (<CarInfoForm value={currentVehicleValue} onChange={setCurrentVehicleValue}/>)}
                    {isPedestrian && (<PedestrianInfoForm value={currentPedestrianValue} onChange={setCurrentPedestranValue}/>)}
                    {isOther && (<OtherInfoForm value={currentOtherValue} onChange={setCurrentOtherValue}/>)}
                </div>
                <div className="flex flex-row w-full justify-evenly h-10">
                    <button onClick={() => setVisibility(false)}
                    className="bg-gray-300 w-1/4">Cancel</button>
                    {(isBike || isVehicle || isPedestrian || isOther) && (
                        <button onClick={() => handleSave()}
                        className="bg-MainGreen-300 w-1/4 text-white">Save</button>
                    )}
                </div>
            </div>
        </div>
    )
}

/* --------------------- UpdateBike -------------------------- */
interface UpdateBikeProps {
    index: number;
    setBikeValue: (updatedBikeValue : bikeInformation[]) => void;
    bikeValue: bikeInformation[];
    setVisibility: (visibility: boolean) => void;
}

const UpdateBike = ({index, setBikeValue, bikeValue, setVisibility}: UpdateBikeProps) => {
    const [currentBikeInfo, setCurrentBikeInfo] = useState<bikeInformation>(bikeValue[index]);

    const handleBikeUpdate = () => {
        const updatedBikeValue = bikeValue
        updatedBikeValue[index] = currentBikeInfo
        setBikeValue(updatedBikeValue)
        setVisibility(false)
    }

    return (
        <div className="fixed flex justify-center items-center z-20 inset-0 bg-black bg-opacity-75 overflow-auto">
            <div className="bg-white py-2 w-96 rounded-md">
                <p className="mb-4 w-full text-center">Update Bike</p>
                <div className="">
                    <BikeInfoForm value={bikeValue[index]} onChange={setCurrentBikeInfo}/>
                </div>
                <div>
                <div className="flex flex-row w-full justify-evenly h-10">
                    <button onClick={() => setVisibility(false)}
                    className="bg-gray-300 w-1/4">Cancel</button>
                    <button onClick={() => handleBikeUpdate()}
                    className="bg-MainGreen-300 w-1/4 text-white">Save</button>
                </div>                </div>
            </div>            
        </div>
    )
}

/* --------------------- UpdateVehicle -------------------------- */
interface UpdateVehicleProps {
    index: number;
    setVehicleValue: (updatedBikeValue : carInformation[]) => void;
    vehicleValue: carInformation[];
    setVisibility: (visibility: boolean) => void;
}

const UpdateVehicle = ({index, setVehicleValue, vehicleValue, setVisibility}: UpdateVehicleProps) => {
    const [currentVehicleInfo, setCurrentVehicleInfo] = useState<carInformation>(vehicleValue[index]);

    const handleBikeUpdate = () => {
        const updatedVehicleValue = vehicleValue
        updatedVehicleValue[index] = currentVehicleInfo
        setVehicleValue(updatedVehicleValue)
        setVisibility(false)
    }

    return (
        <div className="fixed flex justify-center items-center z-20 inset-0 bg-black bg-opacity-75 overflow-auto">
            <div className="bg-white py-2 w-96 rounded-md">
                <p className="mb-4 w-full text-center">Update Vehicle</p>
                <div className="">
                    <CarInfoForm value={vehicleValue[index]} onChange={setCurrentVehicleInfo}/>
                </div>
                <div>
                <div className="flex flex-row w-full justify-evenly h-10">
                    <button onClick={() => setVisibility(false)}
                    className="bg-gray-300 w-1/4">Cancel</button>
                    <button onClick={() => handleBikeUpdate()}
                    className="bg-MainGreen-300 w-1/4 text-white">Save</button>
                </div>                </div>
            </div>            
        </div>
    )
}