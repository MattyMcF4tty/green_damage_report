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
import { pageProps } from "@/utils/utils";
import { getData, getImages, updateData, uploadImage } from "@/firebase/clientApp";
import WitnessList from "@/components/witnessList";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const id = context.query.id as string;

  try {
    const data = await getData(id);
    const images = await getImages(id);

    return {props: {
      data: data,
      images: images || {'GreenMobility': [], 'OtherParty': []},
      id: id,
    }}
  }
  catch (error) {
    console.error(`Something went wrong fetching data:\n${error}\n`)

    return {
      props: {
        data: null,
        images: {'GreenMobility': [], 'OtherParty': []},
        id: id
      }
    }
  }
}

const HowPage:NextPage<pageProps> = ({data, images, id}) => {
  const router = useRouter();

  const [accidentDescription, setAccidentDescription] = useState<string>(data?.accidentDescription || "");
  const [greenDriverSpeed, setGreenDriverSpeed] = useState<string>(data?.speed || "");
  const [damageDescription, setDamageDescription] = useState<string>(data?.damageDescription || "");
  const [policePresent, setPolicePresent] = useState<boolean | null>(data!.policePresent);
  const [policeReport, setPoliceReport] = useState<boolean | null>(data!.policeReportExist);
  const [journalNumber, setJournalNumber] = useState<string>(data?.policeReportNumber || "");
  const [witnessesPresent, setWitnessesPresent] = useState<boolean | null>(data!.witnessesPresent);
  const [witnesses, setWitnesses] = useState<{name:string, phone:string, email:string}[]>(data?.witnesses || [])

  const [greenImages, setGreenImages] = useState<string[] | null>(images!['GreenMobility']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* Making witnesses to the correct datatype and securing only correct data is sent to server */
    const witnessesData = witnesses.map((witness) => ({
      name: witness.name,
      phone: witness.phone,
      email: witness.email,
    }));

    /* Make sure to clear typed data if police or witnesses were not present */
    if (witnessesPresent) {
      setWitnesses([])
    }
    if (!policePresent || !policeReport) {
      setJournalNumber("")
    }

    const data = {
      accidentDescription: accidentDescription,
      speed: greenDriverSpeed,
      damageDescription: damageDescription,
      policeReportNumber: journalNumber,

      policePresent: policePresent,
      policeReportExist: policeReport,
      witnessesPresent: witnessesPresent,
      witnesses: witnessesData,
    };

    await updateData(id, data);

    router.push(`where?id=${id}`); 
  }

  return (
    <form className="w-full" onSubmit={(e) => handleSubmit(e)}>
      {/* Accident description collection */}
      <div>
        <TextField
          id="accidentDescription"
          labelText="Describe what happened"
          maxLength={200}
          required={true}
          value={accidentDescription}
          onChange={setAccidentDescription}
        />
      </div>

      {/* Accident speed collection */}
      {/* TODO: Make it collect involved parties and request speed from every party */}
      <div>
        <Inputfield
          labelText="Your speed in [km/h]"
          id="GreenDriverSpeed"
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
          labelText="Take pictures of damages on GreenMobility car"
          required={true}
          images={greenImages}
          imageType='GreenMobility'
          multiple={true}
        />

        <ImageField
          reportID={id}
          id="LeftImage"
          labelText="Take pictures of damages to other partys"
          required={true}
          images={greenImages}
          imageType='GreenMobility'
          multiple={true}
        />
      </div>

      {/* Damage description collection */}
      <div>
        <TextField
          id="damageDescription"
          labelText="Describe the damages to involved parties"
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
              labelText="Has a police report been made?"
              id="PoliceReport"
              required={true}
              value={policeReport}
              onChange={setPoliceReport}
            />
            {policeReport && (
              <Inputfield
                labelText="enter the journal number"
                id="JournalNumber"
                required={true}
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
          labelText="Were there witnesses present?"
          required={true}
          value={witnessesPresent}
          onChange={setWitnessesPresent}
        />
        {witnessesPresent && <WitnessList value={witnesses} onChange={setWitnesses}/>}
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row w-1/3 justify-start h-12  ml-16">
          <BackButton pageName={`what?id=${id}`} />
        </div>

        <div className="flex flex-row w-1/3 justify-end mr-20">
          <NextButton />
        </div>
      </div>
    </form>
  );
}

export default HowPage;
