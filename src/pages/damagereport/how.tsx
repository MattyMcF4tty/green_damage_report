import React, { useEffect, useState } from "react";
import {
  TextField,
  Inputfield,
  YesNo,
} from "@/components/customeInputfields/custom_inputfields";
import NextButton from "@/components/buttons/next";
import BackButton from "@/components/buttons/back";
import { useRouter } from "next/router";
import { GetServerSidePropsContext, NextPage } from "next";
import WitnessList from "@/components/otherPartys/witnessList";
import { CustomerDamageReport } from "@/utils/schemas/damageReportSchemas/customerReportSchema";
import { patchCustomerDamageReport } from "@/utils/logic/damageReportLogic.ts/apiRoutes";
import { DamageReportPageProps } from "@/utils/schemas/miscSchemas/pagePropsSchema";
import { getDamageReport, getDamageReportFolderDownloadUrls } from "@/utils/logic/damageReportLogic.ts/logic";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const reportId = context.query.id as string;

  const damageReport = new CustomerDamageReport();
  damageReport.updateFields(await getDamageReport(reportId));
  
  if (damageReport.isExpired() || damageReport.isFinished()) {
    return {
      redirect: {
        destination: "/damagereport/reportfinished",
        permanent: false,
      },
    };
  }

  return {
    props: {
      data: damageReport.crypto('decrypt'),
      id: reportId,
    },
  };
};

const HowPage: NextPage<DamageReportPageProps> = ({ data, id }) => {
  const router = useRouter();
  const serverData = new CustomerDamageReport();
  serverData.updateFields(data);
  const [allowClick, setAllowClick] = useState(true);

  const [accidentDescription, setAccidentDescription] = useState(
    serverData.accidentDescription
  );
  const [greenDriverSpeed, setGreenDriverSpeed] = useState(serverData.speed);

  const [policePresent, setPolicePresent] = useState(serverData.policePresent);
  const [policeReport, setPoliceReport] = useState(
    serverData.policeReportExist
  );
  const [journalNumber, setJournalNumber] = useState(
    serverData.policeReportNumber
  );
  const [witnessesPresent, setWitnessesPresent] = useState(
    serverData.witnessesPresent
  );
  const [witnesses, setWitnesses] = useState(serverData.witnesses);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAllowClick(false);

    /* Make sure to clear typed data if police or witnesses were not present */
    if (witnessesPresent) {
      setWitnesses([]);
    }

    /* Clear police data if checkboxes is not checked */
    if (!policePresent) {
      setPoliceReport(null);
    }
    if (!policeReport) {
      setJournalNumber(null);
    }

    serverData.updateFields({
      accidentDescription: accidentDescription,
      speed: greenDriverSpeed,
      policeReportNumber: journalNumber,

      policePresent: policePresent,
      policeReportExist: policeReport,
      witnessesPresent: witnessesPresent,
      witnesses: witnesses,
    });

    try {
      await patchCustomerDamageReport(id, serverData.toPlainObject());
    } catch (error) {
      setAllowClick(true);
      return;
    }
    
    router.push(`where?id=${id}`);
  };

  return (
    <form className="w-full" onSubmit={(e) => handleSubmit(e)}>
      {/* Accident description collection */}
      <div>
        <p className="text-MainGreen-300 mb-8 flex justify-start font-bold text-[20px]">
          Incident Occurrence Details
        </p>
        <div className="">
          <TextField
            id="accidentDescription"
            labelText="Please describe the incident"
            maxLength={200}
            required={true}
            value={accidentDescription}
            onChange={setAccidentDescription}
          />
        </div>
      </div>

      {/* Accident speed collection */}
      <div className="">
        <Inputfield
          id="speedcollection"
          labelText="Please enter your speed for when the incident occurred"
          required={true}
          type="number"
          value={greenDriverSpeed}
          onChange={setGreenDriverSpeed}
          placeHolder="km/h"
        />
      </div>

      {/* Police Report collection */}
      <div className="">
        <YesNo
          labelText="Were the police present?"
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
                type="journalNumber"
                value={journalNumber}
                onChange={setJournalNumber}
                pattern="journalNumber"
                placeHolder="1234-12345-12345-12"
              />
            )}
          </div>
        )}
      </div>

      {/* Witnesses collection */}
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
          <NextButton disabled={!allowClick}/>
        </div>
      </div>
    </form>
  );
};

export default HowPage;
