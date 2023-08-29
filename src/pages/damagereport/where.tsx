import React, { useState } from "react";
import {
  PedestrianInformation,
} from "../../components/opposite_information/person_information_form";
import {
  YesNo,
} from "../../components/custom_inputfields";
import {
  carInformation,
} from "../../components/opposite_information/car_information_form";
import { bikeInformation } from "../../components/opposite_information/bike_information_form";
import { OtherInformation } from "../../components/opposite_information/other_information_form";
import BackButton from "@/components/buttons/back";
import NextButton from "@/components/buttons/next";
import { getData, updateData } from "@/firebase/clientApp";
import { GetServerSidePropsContext, NextPage } from "next";
import { pageProps, reportDataType } from "@/utils/utils";
import { OtherPartyList } from "@/components/otherPartys/otherPartyList";
import GoogleMapsField from "@/components/google_maps_field";
import { useRouter } from "next/router";
import Google from "@/components/google";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const id = context.query.id as string;

  try {
    const data: reportDataType = await getData(id);
    
    if (data.finished) {
      return {
        redirect: {
          destination: "reportfinished",
          permanent: false,
        },
      };
    }

    return {
      props: {
        data: data.toPlainObject(),
        id: id,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "reportfinished",
        permanent: false,
      },
    };
  }
};

const WherePage: NextPage<pageProps> = ({ data, id }) => {
  const router = useRouter()
  const serverData = new reportDataType();
  serverData.updateFields(data);

  /* logic */
  const [otherPartyInvolved, setOtherPartyInvolved] = useState<boolean | null>(serverData.otherPartyInvolved);
  const [isSingleVehicleChecked, setIsSingleVehicleChecked] = useState<boolean | null>(serverData.singleVehicleAccident);

  /* Data */
  const [carInfo, setCarInfo] = useState(serverData.vehicleInfo.map(info => new carInformation(info.name, info.phone, info.email, info.driversLicenseNumber, info.insurance, info.numberplate, info.model, info.location)));
  const [bikeInfo, setBikeInfo] = useState(serverData.bikerInfo.map(info => new bikeInformation(info.name, info.phone, info.email, info.ebike, info.personDamage, info.location)));
  const [otherInfo, setOtherInfo] = useState(serverData.otherObjectInfo.map(info => new OtherInformation(info.description, info.information, info.location)));
  const [pedestrianInfo, setPedestrianInfo] = useState(serverData.pedestrianInfo.map(info => new PedestrianInformation(info.name, info.phone, info.email, info.personDamage, info.location)));
  const [accidentLocation, setAccidentLocation] = useState({lat:serverData.accidentLocation.lat, lng:serverData.accidentLocation.lng})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* Data that gets sent to server */
    serverData.updateFields({
      vehicleInfo: carInfo.map(info => ({
        name: info.name,
        phone: info.phone,
        email: info.email,
        driversLicenseNumber: info.driversLicenseNumber,
        insurance: info.insurance,
        numberplate: info.numberplate,
        model: info.model,
        location: info.location
      })),
      bikerInfo: bikeInfo.map(info => ({
        name: info.name,
        phone: info.phone,
        email: info.email,
        ebike: info.ebike,
        personDamage: info.personDamage,
        location: info.location
      })),
      otherObjectInfo: otherInfo.map(info => ({
        description: info.description,
        information: info.information,
        location: info.location
      })),
      pedestrianInfo: pedestrianInfo.map(info => ({
        name: info.name,
        phone: info.phone,
        email: info.email,
        personDamage: info.personDamage,
        location: info.location
      })),
      accidentLocation: accidentLocation,
      
      /* PAGE LOGIC */
      otherPartyInvolved: otherPartyInvolved,
      singleVehicleAccident: isSingleVehicleChecked,    
    });

    await updateData(id, serverData);
    router.push(`confirmation?id=${id}`);
  };
/*   const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
 */
  /*     <LoadScript googleMapsApiKey={apiKey || ""} libraries={["places"]}> */
  return (
      <form
        className="flex flex-col items-start w-full h-full"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="w-full">
          <p className="text-MainGreen-300 mb-8 flex justify-start font-bold text-[20px]">
            Vital Information
          </p>
          <YesNo
            required={true}
            id="collisionWithOtherParty"
            labelText="Collision with another object?"
            value={otherPartyInvolved}
            onChange={setOtherPartyInvolved}
          />
        </div>
        {otherPartyInvolved && (
          <div className="flex flex-col justify-left text-left w-full mb-4">
            <div id="whatvehicle" className="flex flex-col w-full">
              <div>
                <label htmlFor="whatvehicle">What object?</label>
              </div>
              <div className="flex flex-row justify-between">
                <OtherPartyList
                  bikeValue={bikeInfo}
                  setBikeValue={setBikeInfo}
                  vehicleValue={carInfo}
                  setVehicleValue={setCarInfo}
                  pedestrianValue={pedestrianInfo}
                  setPedestrianValue={setPedestrianInfo}
                  otherInfoValue={otherInfo}
                  setOtherInfoValue={setOtherInfo}
                />
              </div>
            </div>
            <div className="my-4">
              <p>
                Please indicate on the map where the GreenMobility car was
                located, as well as the location of the other partys, by using
                the markers. Please use the draggable line to mark the car's
                trajectory leading to the collision.
              </p>
            </div>

            <div className="w-full">
{/*               <GoogleMapsField 
              showMap={true} 
              startZoom={17} 
              startPos={{lat:55.68292552469843, lng:12.585443426890635}}
              accidentLocation={accidentLocation}
              setAccidentLocation={setAccidentLocation}
              bikes={bikeInfo}
              setBikes={setBikeInfo}
              vehicles={carInfo}
              setVehicles={setCarInfo}
              pedestrians={pedestrianInfo}
              setPedestrians={setPedestrianInfo}
              objects={otherInfo}
              setObjects={setOtherInfo}
              /> */}

              <Google
              show={true}
              showAutocomplete={true}
              />
            </div>
          </div>
        )}

        {!otherPartyInvolved && (
          <div className="w-full">
            <div>
              <YesNo
                id="SingleVehicleAccident"
                labelText="Single vehicle accident"
                required={true}
                value={isSingleVehicleChecked}
                onChange={setIsSingleVehicleChecked} // Update the handler
              />
            </div>
            <div className="w-full">
              {isSingleVehicleChecked && (
                <div/>
/*                 <Google show={false} showAutocomplete={true} />
 */              )}
            </div>
          </div>
        )}

        {/*       {isCollisionWithObjectChecked && (
        <ObjectInfoForm onchange={setObjectInfo} />
      )} */}

        {/*       <div className="flex flex-col justify-center">
        <YesNo
          required={true}
          id="personDamage"
          labelText="Person damage?"
          value={isPersonDamageChecked}
          onChange={setIsPersonDamageChecked}
        />
      </div>

      {isPersonDamageChecked && (
        <div>
          <TextField
            id="damageDescription"
            maxLength={400}
            labelText="Descripe the damage"
            required={true}
            value={damageDescription}
            onChange={setDamageDescription}
          />
        </div>
      )} */}

        <div className="flex flex-row justify-between w-full mt-4">
          <div className="flex flex-row w-16 justify-start h-14 ml-10 ">
            <BackButton pageName={`how?id=${id}`} />
          </div>

          <div className="flex flex-row w-16 justify-end h-14 mr-10">
            <NextButton />
          </div>
        </div>
      </form>
  );
};

export default WherePage;
