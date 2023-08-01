import { kMaxLength } from "buffer";
import React, { useState, useRef, useEffect, useImperativeHandle } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import metadata from "libphonenumber-js/metadata.min.json";

function PhoneNumber() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState("");

  const [maxLength, setMaxLength] = useState(null);

  const [country, setCountry] = useState("");

  useEffect(() => {
    if (country) {
      const countryMetadata = metadata.countries[country];
      const maxLength = countryMetadata
        ? countryMetadata[1] + countryMetadata[2].length
        : null;
      setMaxLength(maxLength);
    } else {
      setMaxLength(null);
    }
  }, [country]);

  const handlePhoneNumberChange = (value: string) => {
    if (!value) {
      setPhoneNumber(value);
      return;
    }

    if (maxLength && value.replace(/\D+/g, "").length <= maxLength) {
      setPhoneNumber(value);
    } else if (!maxLength) {
      setPhoneNumber(value);
    }
  };

  useEffect(() => {
    setFormattedPhoneNumber(formatPhoneNumberIntl(phoneNumber));
  }, [phoneNumber]);

  return (
    /* TODO: style input boxen */
    <div>
      <p>Drivers phone number</p>
      <div className="bg-MainGreen-100 h-10 text-lg p-1 rounded-none border-[1px] focus:border-[3px] border-MainGreen-200 outline-none mb-4">
        <PhoneInput
          limitMaxLength
          placeholder="Indtast tlf. nr."
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          onCountryChange={setCountry}
          country={country}
          inputStyle={{ backgroundColor: "lightblue" }}
          className="border-none"
        />
      </div>
    </div>
  );
}

export default PhoneNumber;
