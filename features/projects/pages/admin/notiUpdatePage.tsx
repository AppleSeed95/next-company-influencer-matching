"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("@/components/organisms/CKEditor"), { ssr: false });

import TextArea from "@/components/atoms/textarea";
import axios from "axios";
import Modal from "../../utils/modal";
const confirmMsg = "操作が成功しました。";
const NotiPage: React.FC = () => {
  const [data, setData] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("/api/auth/noti");
      if (result.data) setData(result.data.data);
    };
    fetchData();
  }, []);
  const handleUpdate = async () => {
    const noti = {
      companyNoti: "",
      influencerNoti: "",
      mainNoti: "",
    };
    const result = await axios.post("/api/auth/noti", { ...noti, ...data });
    if (result.data.type === "success") {
      setShowConfirm(true);
    }
  };
  return (
    <div className="bg-[white] px-[35px] sp:px-[12px] sp:text-small ">
      <div
        className={
          showConfirm
            ? "bg-black bg-opacity-25 w-full min-h-screen fixed left-0 top-0 z-10 overflow-auto duration-500"
            : "bg-black bg-opacity-25 w-full min-h-screen fixed left-0 top-0 z-10 overflow-auto opacity-0 pointer-events-none duration-500"
        }
      >
        <Modal
          body={confirmMsg}
          onOk={() => setShowConfirm(false)}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
      <div className="flex sp:hidden items-center py-[20px]  w-[full] border-b-[1px] border-[#DDDDDD] mt-[70px] sp:mt-[96px]">
        <span className="text-title sp:text-sptitle">お知らせ更新</span>
      </div>
      <div className="w-[45%] sp:pt-[80px] sp:w-[100%] m-auto mt-[55px]">
        <div className="border-b-[1px] border-[#DDDDDD]">
          <span className="text-[18px] sp:text-sm">企業</span>
          <div className="px-[26px] sp:py-[10px] py-[30px]">
            <span className="text-[#6F6F6F]">重要なお知らせ</span>
            <TextArea
              value={data?.mainNoti}
              textAreaClassName="mt-[20px] sp:mt-[10px] w-[100%] h-[120px]   "
              placeholder="お知らせを入力してください。"
              handleChange={(val) => setData({ ...data, mainNoti: val })}
            />
            {/* <Editor
              value={data?.mainNoti}
              onChange={(v) => {
                setData({ ...data, mainNoti: v })
              }
              }
            /> */}
            <div className="w-[100%] text-right mt-[20px] sp:mt-[10px]">
              <Button
                buttonType={ButtonType.PRIMARY}
                handleClick={handleUpdate}
                buttonClassName="mt-[10px]"
              >
                <span className="flex items-center">
                  <span className="sp:text-small">更新</span>
                  <img
                    className="w-[14px] ml-[5px]"
                    src="/img/refresh.svg"
                    alt="refresh"
                  />
                </span>
              </Button>
            </div>
          </div>
          <div className="px-[26px]">
            <span className="text-[#6F6F6F]">お知らせ</span>
            <TextArea
              value={data?.companyNoti}
              textAreaClassName="mt-[20px] sp:mt-[10px] w-[100%] h-[120px]   "
              placeholder="お知らせを入力してください。"
              handleChange={(val) => setData({ ...data, companyNoti: val })}
            />
            {/* <Editor
              value={data?.companyNoti}
              onChange={(v) => {
                setData({ ...data, companyNoti: v })
              }
              }
            /> */}
            <div className="w-[100%] text-right mt-[20px] sp:mt-[10px] mb-[46px] sp:mb-[20px]">
              <Button
                buttonType={ButtonType.PRIMARY}
                buttonClassName="mt-[10px]"
                handleClick={handleUpdate}
              >
                <span className="flex items-center">
                  <span>更新</span>
                  <img
                    className="w-[14px] ml-[5px]"
                    src="/img/refresh.svg"
                    alt="refresh"
                  />
                </span>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-[70px] sp:mt-[30px] mb-[150px]">
          <span className="text-[18px] sp:text-sm">インフルエンサー</span>
          <div className="px-[26px] py-[30px]">
            <span className="text-[#6F6F6F]">お知らせ</span>
            <TextArea
              value={data?.influencerNoti}
              textAreaClassName="mt-[20px] sp:mt-[10px] w-[100%] h-[120px]    "
              placeholder="お知らせを入力してください。"
              handleChange={(val) => setData({ ...data, influencerNoti: val })}
            />
            {/* <Editor
              value={data?.influencerNoti}
              onChange={(v) => {
                setData({ ...data, influencerNoti: v })
              }
              }
            /> */}
            <div className="w-[100%] text-right mt-[20px] sp:mt-[10px]">
              <Button
                buttonType={ButtonType.PRIMARY}
                handleClick={handleUpdate}
                buttonClassName="mt-[10px]"
              >
                <span className="flex items-center">
                  <span>更新</span>
                  <img
                    className="w-[14px] ml-[5px]"
                    src="/img/refresh.svg"
                    alt="refresh"
                  />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NotiPage;
