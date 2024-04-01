"use client";
import React, { Children } from "react";
import { ReactNode } from "react";
import { ButtonType } from "./buttonType";

export interface ButtonProps {
  buttonClassName?: string;
  buttonType: ButtonType;
  children: ReactNode;
  submit?: boolean;
  handleClick?: () => void;
}

const classNames = [
  "px-[20px] py-[10px] rounded-[5px] text-[white] bg-[#3F8DEB] hover:bg-[#2e6fbe] hover:shadow-lg duration-500 ",
  "px-[20px] py-[10px] rounded-[5px] text-[white] bg-[#A9A9A9] hover:bg-[#8f8f8f] hover:shadow-lg duration-500 ",
  "px-[20px] py-[10px] rounded-[5px] text-[white] bg-[#EE5736] hover:bg-[#a33f28] hover:shadow-lg duration-500 ",
  "px-[15px] py-[7px] bg-[#A9A9A9] text-[white] hover:bg-[#767676] hover:shadow-lg duration-500 ",
  "p-[15px] py-[7px] bg-[#3F8DEB] text-[white] rounded-[50%] hover:bg-[#2d6bb7] hover:shadow-lg duration-500 ",
  "px-[20px] py-[10px] rounded-[5px] bg-[white] rounded-[5px] border-[1.5px] text-[#3F8DEB] border-[#3F8DEB] hover:bg-[#b7b7b7] hover:shadow-lg duration-500  ",
];
const Button: React.FC<ButtonProps> = ({
  buttonClassName = "",
  buttonType = ButtonType.PRIMARY,
  children,
  handleClick,
  submit,
}: ButtonProps) => {
  return (
    <button
      type={submit ? "submit" : "button"}
      onClick={handleClick}
      className={'button shadow-lg relative ' + classNames[buttonType] + buttonClassName}
    >
      <div className="bg-[#a33f28]"></div>
      {children}
    </button>
  );
};

export default Button;
