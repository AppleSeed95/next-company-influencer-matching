"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export interface topProps {
  influencerMode?: boolean;
}

export default function TopPage({ influencerMode }: topProps) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("/api/auth/noti");
      setData(result.data?.data);
    };
    document.title = '管理画面TOP'
    fetchData();
  }, []);
  return (
    <div className="bg-[white] px-[35px] sp:px-[12px] sp:text-small ">
      <div className="flex items-center py-[20px]  w-[full] border-b-[1px] border-[#DDDDDD] mt-[70px] sp:mt-[96px]">
        <span className="text-title sp:text-sptitle">管理画面TOP</span>
      </div>
      <div className="sp:w-[100%] mt-[55px] px-[30px]">
        {!influencerMode && (
          <div className="border-b-[1px] border-[#DDDDDD] mx-[30px]">
            <span className="text-header text-[#EE5736] ">重要なお知らせ</span>
            <div className="py-[30px]">
              {data?.mainNoti.split("\n")?.map((a, key) => (
                <div dangerouslySetInnerHTML={{ __html: a }} key={key} />
              ))}
            </div>
          </div>
        )}
        <div className="mx-[30px] mt-[40px]">
          <span className="text-header ">運営からのお知らせ</span>
          <div className="py-[30px]">
            {influencerMode
              ? data?.influencerNoti
                .split("\n")
                ?.map((a, key) => <div key={key} dangerouslySetInnerHTML={{ __html: a }} />)
              : data?.companyNoti
                .split("\n")
                ?.map((a, key) => <div key={key} dangerouslySetInnerHTML={{ __html: a }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
