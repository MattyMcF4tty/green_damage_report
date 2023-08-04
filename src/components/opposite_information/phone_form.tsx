import { kMaxLength } from "buffer";
import React, { useState, useRef, useEffect, useImperativeHandle } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import metadata from "libphonenumber-js/metadata.min.json";
import { formatPhoneNumber } from "react-phone-number-input";
import { getCountryCallingCode } from "libphonenumber-js";
import { CountryCode } from "libphonenumber-js";
import { parsePhoneNumberFromString } from "libphonenumber-js";

interface PhoneNumberProps {
  value?: string;
  onChange: (phoneNumber: string) => void;
}

// ... (imports)

const PhoneNumber = ({ value, onChange }: PhoneNumberProps) => {
  const [phoneNumber, setPhoneNumber] = useState<string>(value || "");
  const [countryCode, setCountryCode] = useState<string | undefined>();

  useEffect(() => {
    if (value) {
      const parsedPhoneNumber = parsePhoneNumberFromString(value);
      if (parsedPhoneNumber) {
        setCountryCode(parsedPhoneNumber.countryCallingCode);
      } else {
        setCountryCode("");
      }
    } else {
      setCountryCode("");
    }
  }, [value]);

  const handlePhoneNumberChange = (inputPhoneNumber: string) => {
    const numericPhoneNumber = inputPhoneNumber.replace(/\D/g, ""); // Remove non-numeric characters
    setPhoneNumber(numericPhoneNumber);
    onChange(numericPhoneNumber);
  };

  return (
    <div className="mb-4">
      <label htmlFor="phonenumber">Phone number</label>
      <div className="bg-MainGreen-100 border-[1px] border-MainGreen-200 pl-2">
        <PhoneInput
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          metadata={metadata}
          country={countryCode}
          international={false}
          limitMaxLength
          required={true}
        />
      </div>
    </div>
  );
};

export default PhoneNumber;