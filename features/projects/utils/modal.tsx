"use client";
import React from "react";
import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";

export interface InfluencerProps {
  onOk?: () => void;
  body?: React.ReactNode;
  onCancel?: () => void;
  noFooter?: boolean;
}

const Modal: React.FC<InfluencerProps> = ({
  onCancel,
  body,
  onOk,
  noFooter
}: InfluencerProps) => {
  return (
    <div className="text-center bg-[white]  px-[35px] sp:px-[12px] sp:text-small w-[20%] sp:w-[90%] m-auto relative shadow-lg ">
      <button
        className="absolute bg-[#5E5E5E] text-[white] px-[15px] py-[10px] top-0 right-0 cursor-pointer"
        onClick={(e) => {
          if (onCancel) onCancel();
        }}
      >
        x
      </button>
      <div className="pt-[30px] mt-[350px]">
        <div>{body}</div>
        {!noFooter && <Button
          buttonType={ButtonType.PRIMARY}
          handleClick={() => onOk()}
          buttonClassName="m-[20px]"
        >
          確認
        </Button>}
      </div>
    </div>
  );
};
export default Modal;
