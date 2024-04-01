"use client";
import React, { useState } from "react";

export interface InputProps {
  inputClassName?: string;
  placeholder?: string;
  password?: boolean;
  notRequired?: boolean;
  requirMsg?: string;
  style?: string;
  styleMsg?: string;
  value?: string;
  format?: string;
  dateTime?: boolean;
  formatMsg?: string;
  type?: string;
  handleChange: (val: string) => void;
  handleKeyPress?: (event: any) => void;
}

const Input: React.FC<InputProps> = ({
  inputClassName,
  value,
  password,
  placeholder,
  handleChange,
  notRequired,
  requirMsg,
  format,
  formatMsg,
  dateTime,
  type,
  handleKeyPress,
}: InputProps) => {
  const [error, setError] = useState("errorMsg");
  const [isValid, setIsValid] = useState(true);
  const validate = (val: string) => {
    if (!notRequired && val === "") {
      setError(requirMsg);
      setIsValid(false);
      handleChange(val);
      return;
    }
    handleChange(val);
    if (format) {
      const regex = new RegExp(format);
      if (!regex.test(val.trim())) {
        setError(formatMsg);
        setIsValid(false);
        return;
      }
    }
    setIsValid(true);
  };
  return (
    <div className={inputClassName}>
      <input
        key={"input"}
        type={
          password
            ? "password"
            : dateTime
              ? "datetime-local"
              : type
                ? type
                : "text"
        }
        defaultValue={value}
        className={"border border-[#AEAEAE] h-[35px] pl-[12px]  w-full"}
        placeholder={placeholder}
        onChange={(e) => {
          validate(e.target.value);
        }}
        onKeyPress={handleKeyPress}
      ></input>
      {
        (requirMsg || formatMsg) && (
          <div
            className={
              isValid
                ? "text-left text-[#EE5736] text-[11px] opacity-0  duration-700"
                : "text-left text-[#EE5736] text-[11px] duration-700"
            }
          >
            {error}
          </div>
        )
      }
    </div >
  );
};

export default Input;
