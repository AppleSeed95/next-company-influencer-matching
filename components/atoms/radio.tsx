import { title } from "process";
import React, { useEffect, useState } from "react";

export interface RadioProps {
  options?: string[];
  title?: string;
  defaultValue?: string;
  handleChange?: (val: string) => void;
}

const RadioBtn: React.FC<RadioProps> = ({
  options,
  handleChange,
  defaultValue,
}: RadioProps) => {
  const [stateValue, setStateValue] = useState(defaultValue);
  useEffect(() => {
    setStateValue(defaultValue);
  }, [defaultValue]);
  return (
    <div className="flex">
      {options?.map((aOption, idx) => (
        <div key={idx} className="flex items-center mr-[10px]">
          <input
            type="radio"
            checked={
              defaultValue ? aOption === stateValue : aOption === options[0]
            }
            className="w-[20px] h-[20px]"
            name={title}
            value={aOption}
            onChange={(e) => {
              handleChange(e.target.value);
            }}
          />
           <span>{aOption}</span>
        </div>
      ))}
    </div>
  );
};

export default RadioBtn;
