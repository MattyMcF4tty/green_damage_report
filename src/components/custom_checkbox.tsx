import React, { useEffect, useState } from "react";

interface CheckboxProps {
  id: string;
  labelText: string;
  onChange: (checked: boolean) => void;
}

export default function Checkbox(props: CheckboxProps) {
  const { id, labelText, onChange } = props;

  /* 0 is when the checkbox is first initialized and therefor is not filled, 1 is Yes, 2 is No */
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    if (checked === true) {
      onChange(true);
    } else {
      onChange(false);
    }
  }, [checked]);

  return (
    <div className="flex flex-row-reverse items-center mr-4">
      <label htmlFor={"Checkbox" + id}>{labelText}</label>
      <input
        className="accent-MainGreen-300 items-center mr-1 scale-125"
        id={"Checkbox" + id}
        type="checkbox"
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
      />
    </div>
  );
}
