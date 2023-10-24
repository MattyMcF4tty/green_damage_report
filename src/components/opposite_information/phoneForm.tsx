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
  value: string | null;
  labelText: string;
  onChange: (phoneNumber: string) => void;
}

const PhoneNumber = ({ value, onChange, labelText }: PhoneNumberProps) => {
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState<string>(
    value ? formatPhoneNumber(value) : ""
  );

  const [selectedCountry, setSelectedCountry] = useState<
    CountryCode | undefined
  >(undefined);
  const handlePhoneNumberChange = (phoneNumber: string) => {
    setFormattedPhoneNumber(phoneNumber);
    onChange(phoneNumber);
  };

  const handleCountryChange = (country: CountryCode) => {
    setSelectedCountry(country);
  };
  useEffect(() => {
    if (formattedPhoneNumber && selectedCountry) {
      const phoneNumber = parsePhoneNumberFromString(
        formattedPhoneNumber,
        selectedCountry
      );
      if (phoneNumber) {
        setFormattedPhoneNumber(phoneNumber.formatNational());
      }
    }
  }, [formattedPhoneNumber, selectedCountry]);

  const [countryCode, setCountryCode] = useState<string | undefined>();
  const [bgColor, setBgColor] = useState("bg-white");

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

  useEffect(() => {
    if (value === "" || value === null) {
      setBgColor("bg-white");
    } else {
      setBgColor("bg-MainGreen-100");
    }
  }, [value]);

  return (
    <div className="mb-4">
      <label htmlFor="phonenumber" className="">
        {labelText}
      </label>
      <div className={`${bgColor}  h-10  mt-2`}>
        <PhoneInput
          placeholder="Enter phone number"
          value={formattedPhoneNumber}
          onChange={handlePhoneNumberChange}
          metadata={metadata}
          country={selectedCountry}
          international={false} // We want to format the number without international prefix
          limitMaxLength // This will restrict the number of digits based on the country code
          required={true}
        />
      </div>
    </div>
  );
};

export default PhoneNumber;
