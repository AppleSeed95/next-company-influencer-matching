"use client";
import React, { useState } from "react";
import { ReactNode } from "react";
import Input from "@/components/atoms/input";
import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";

export interface SearchBarProps {
  extendChild: ReactNode;
  title?: ReactNode;
  data: object[];
  keys: string[];
  setVisibleData: (data: object[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  extendChild,
  title,
  data,
  keys,
  setVisibleData,
}: SearchBarProps) => {
  const [showOption, setShowOption] = useState(false);
  const [keyword, setKeyword] = useState("");
  return (
    <div className="bg-[#F8F9FA] w-full border border-[#D3D3D3] mt-[28px] sp:mt-[0px] px-[35px] sp:px-[14px] mb-[34px] sp:mb-[14px]">
      <div className="flex gap-x-[20px] sp:gap-x-[12px] py-[12px] items-center  ">
        {!title && (
          <Input
            handleChange={(v) => setKeyword(v)}
            inputClassName="max-w-[420px] grow sp:text-sp text-small border-[#D3D3D3]"
            placeholder=" キーワードを入力してください"
          />
        )}
        {title && title}
        {!title && (
          <Button
            handleClick={() => {
              console.log(data);

              const passtest = (aData) => {
                if (keyword === "") return true;
                let isMatch = false;
                [...keys, ...Object.keys(data[0])].forEach((aKey) => {
                  if (typeof (aData[aKey]) === 'string') {
                    if (aData[aKey].indexOf(keyword) !== -1) {
                    }
                    isMatch ||= aData[aKey].indexOf(keyword) !== -1;
                  }
                });
                return isMatch;
              };
              setVisibleData(data.filter(passtest));
            }}
            buttonType={ButtonType.DEFAULT}
            buttonClassName="sp:text-small sp:px-[12px]"
          >
            検索
          </Button>
        )}
        <div
          className="flex items-center"
          onClick={() => setShowOption(!showOption)}
        >
          <span className="text-[#3F8DEB] hover:cursor-pointer sp:text-spsmall sp:hidden">
            オプション検索
          </span>
          <img
            src="/img/triangle-down.svg"
            alt="img"
            className="w-[10px] ml-[5px]"
          />
        </div>
      </div>
      {extendChild && showOption && (
        <div className="mb-[28px]">{extendChild}</div>
      )}
    </div>
  );
};

export default SearchBar;
