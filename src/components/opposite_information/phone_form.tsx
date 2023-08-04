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

const PhoneNumber = ({ value, onChange }: PhoneNumberProps) => {
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState<string>(
    value ? formatPhoneNumber(value) : ""
  );

  const handlePhoneNumberChange = (phoneNumber: string) => {
    setFormattedPhoneNumber(phoneNumber);
    onChange(phoneNumber);
  };

  const [countryCode, setCountryCode] = useState<string | undefined>();

  useEffect(() => {
    if (value) {
      const phoneNumber = parsePhoneNumberFromString(value);
      if (phoneNumber) {
        setCountryCode(phoneNumber.countryCallingCode);
      } else {
        setCountryCode("");
      }
    } else {
      setCountryCode("");
    }
  }, [value]);

  return (
    <div className="mb-4">
      <label htmlFor="phonenumber">Phone number</label>
      <div className="bg-MainGreen-100 border-[1px] border-MainGreen-200 pl-2">
        <PhoneInput
          placeholder="Enter phone number"
          value={formattedPhoneNumber}
          onChange={handlePhoneNumberChange}
          metadata={metadata}
          country={countryCode}
          international={false} // We want to format the number without international prefix
          limitMaxLength // This will restrict the number of digits based on the country code
          required={true}
        />
      </div>
    </div>
  );
};

export default PhoneNumber;