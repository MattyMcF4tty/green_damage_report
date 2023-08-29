import React, { useEffect, useState } from "react";
import {
  TextField,
  Inputfield,
  ImageField,
  YesNo,
} from "@/components/custom_inputfields";
import NextButton from "@/components/buttons/next";
import BackButton from "@/components/buttons/back";
import { useRouter } from "next/router";
import { GetServerSidePropsContext, NextPage } from "next";
import { pageProps, reportDataType } from "@/utils/utils";
import { getData, getImages, updateData } from "@/firebase/clientApp";
import WitnessList from "@/components/otherPartys/witnessList";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const id = context.query.id as string;

  try {
    const data: reportDataType = await getData(id);
    const images = await getImages(id);
    
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
        images: images || null,
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

const HowPage: NextPage<pageProps> = ({ data, images, id }) => {
  const router = useRouter();
  const serverData = new reportDataType();
  serverData.updateFields(data);

  const [accidentDescription, setAccidentDescription] = useState(serverData.accidentDescription);
  const [greenDriverSpeed, setGreenDriverSpeed] = useState(serverData.speed);
  const [damageDescription, setDamageDescription] = useState(serverData.damageDescription);
  const [policePresent, setPolicePresent] = useState(serverData.policePresent);
  const [policeReport, setPoliceReport] = useState(serverData.policeReportExist);
  const [journalNumber, setJournalNumber] = useState(serverData.policeReportNumber);
  const [witnessesPresent, setWitnessesPresent] = useState(serverData.witnessesPresent);
  const [witnesses, setWitnesses] = useState(serverData.witnesses);

  const [greenImages, setGreenImages] = useState<string[] | null>(
    images?.["GreenMobility"] || null
  );
  const [otherPartyImages, setOtherPartyImages] = useState<string[] | null>(
    images?.["OtherParty"] || null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* Make sure to clear typed data if police or witnesses were not present */
    if (witnessesPresent) {
      setWitnesses([]);
    }

    /* Clear police data if checkboxes is not checked */
    if (!policePresent) {
      setPoliceReport(null)
    }
    if (!policeReport) {
      setJournalNumber(null);
    }

    serverData.updateFields({
      accidentDescription: accidentDescription,
      speed: greenDriverSpeed,
      damageDescription: damageDescription,
      policeReportNumber: journalNumber,

      policePresent: policePresent,
      policeReportExist: policeReport,
      witnessesPresent: witnessesPresent,
      witnesses: witnesses,
    });

    await updateData(id, serverData);

    router.push(`where?id=${id}`);
  };

  return (
    <form className="w-full" onSubmit={(e) => handleSubmit(e)}>
      {/* Accident description collection */}
      <div>
        <p className="text-MainGreen-300 mb-8 flex justify-start font-bold text-[20px]">
          Incident Occurrence Details
        </p>
        <TextField
          id="accidentDescription"
          labelText="Description of the incident"
          maxLength={200}
          required={true}
          value={accidentDescription}
          onChange={setAccidentDescription}
        />
      </div>

      {/* Accident speed collection */}
      <div>
        <Inputfield
          id="speedcollection"
          labelText="km/h"
          required={true}
          type="number"
          value={greenDriverSpeed}
          onChange={setGreenDriverSpeed}
        />
      </div>

      {/* Picture of damages to green car collection */}
      <div>
        <ImageField
          reportID={id}
          id="FrontImage"
          labelText="Take pictures of damages to the GreenMobility car"
          required={false}
          images={greenImages}
          imageType="GreenMobility"
          multiple={true}
        />

        <ImageField
          reportID={id}
          id="LeftImage"
          labelText="Take pictures of damages to other partys"
          required={false}
          images={otherPartyImages}
          imageType="OtherParty"
          multiple={true}
        />
      </div>

      {/* Damage description collection */}
      <div>
        <TextField
          id="damageDescription"
          labelText="
          Please provide a description of the damages incurred to the parties involved"
          maxLength={500}
          required={true}
          value={damageDescription}
          onChange={setDamageDescription}
        />
      </div>

      {/* Police Report collection */}
      <div>
        <YesNo
          labelText="Were there police present?"
          id="PolicePresent"
          required={true}
          value={policePresent}
          onChange={setPolicePresent}
        />
        {policePresent && (
          <div>
            <YesNo
              labelText="

              Is there a police report recorded?"
              id="PoliceReport"
              required={true}
              value={policeReport}
              onChange={setPoliceReport}
            />
            {policeReport && (
              <Inputfield
                labelText="
                Please enter the police report number"
                id="JournalNumber"
                required={false}
                type="number"
                value={journalNumber}
                onChange={setJournalNumber}
              />
            )}
          </div>
        )}
      </div>

      {/* Witnesses collection */}
      {/* TODO: make witness array where marked */}
      <div>
        <YesNo
          id="WitnessesPresent"
          labelText="
          Were any witnesses present?"
          required={true}
          value={witnessesPresent}
          onChange={setWitnessesPresent}
        />
        {witnessesPresent && (
          <WitnessList value={witnesses} onChange={setWitnesses} />
        )}
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row w-16 justify-start h-14  ml-10">
          <BackButton pageName={`what?id=${id}`} />
        </div>

        <div className="flex flex-row w-16 justify-end h-14 mr-10">
          <NextButton />
        </div>
      </div>
    </form>
  );
};

export default HowPage;
