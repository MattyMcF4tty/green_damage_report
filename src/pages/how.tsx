import React, { useEffect, useState } from "react";
import {
  TextField,
  Inputfield,
  ImageField,
  YesNo,
} from "@/components/custom_inputfields";
import { AccidentInformation } from "@/utils/logic";
import { WitnessList } from "@/components/howPage/witness_collection";
import { NavButtons } from "@/components/navigation";
export default function HowPage() {
  const [accidentDescription, setAccidentDescription] = useState<string>("");
  const [greenDriverSpeed, setGreenDriverSpeed] = useState<string>("");
  const [damageDescription, setDamageDescription] = useState<string>("");
  const [policePresent, setPolicePresent] = useState<boolean>(false);
  const [policeReport, setPoliceReport] = useState<boolean>(false);
  const [journalNumber, setJournalNumber] = useState<string>();
  const [witnessesPresent, setWitnessesPresent] = useState<boolean>(false);

  const [accidentInfo, setAccidentInfo] = useState<AccidentInformation>();

  /* Getting data stored in sessionStorage */
  useEffect(() => {
    console.log(accidentInfo);
  }, []);

  /* Updating the values in accidenInfo */
  useEffect(() => {
    const updateAccidentInfo = new AccidentInformation();

    setAccidentInfo(updateAccidentInfo);
  }, [accidentDescription, greenDriverSpeed, damageDescription]);

  function handleSubmit() {
    console.log("fuck dig");
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Accident description collection */}
      <div>
        <TextField
          id="accidentDescription"
          labelText="Describe what happened"
          maxLength={200}
          required={true}
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
          type="text"
          onChange={setGreenDriverSpeed}
        />
      </div>

      {/* Picture of damages to green car collection */}
      <div>
        <ImageField
          id="FrontImageSelection"
          labelText="Take picture of the front of the GreenMobility car"
          required={true}
        />

        <ImageField
          id="RightImageSelection"
          labelText="Take picture of the right side of the GreenMobility car"
          required={true}
        />

        <ImageField
          id="BackImageSelection"
          labelText="Take picture of the back of the GreenMobility car"
          required={true}
        />

        <ImageField
          id="LeftImageSelection"
          labelText="Take picture of the left side of the GreenMobility car"
          required={true}
        />
      </div>

      {/* Damage description collection */}
      <div>
        <TextField
          id="damageDescription"
          labelText="Describe the damages to involved parties"
          maxLength={500}
          required={true}
          onChange={setDamageDescription}
        />
      </div>

      {/* Police Report collection */}
      <div>
        <YesNo
          labelText="Were there police present?"
          id="PolicePresent"
          required={true}
          onChange={setPolicePresent}
        />
        {policePresent && (
          <div>
            <YesNo
              labelText="Has a police report been made?"
              id="PoliceReport"
              required={true}
              onChange={setPoliceReport}
            />
            {policeReport && (
              <Inputfield
                labelText="enter the journal number"
                id="JournalNumber"
                required={true}
                type="number"
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
          onChange={setWitnessesPresent}
        />
        {witnessesPresent && (
          <div>
            <WitnessList />
          </div>
        )}
      </div>
      <div className="flex flex-row w-full place-content-between h-10 mt-10">
        <button className="w-2/5 bg-MainGreen-300" type="submit">
          Previous
        </button>
        <button className="w-2/5 bg-MainGreen-300" type="submit">
          Next
        </button>
      </div>
    </form>
  );
}
