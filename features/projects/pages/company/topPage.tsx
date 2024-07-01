"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { authUserState } from "@/recoil/atom/auth/authUserAtom";
import Link from "next/link";
import { useRouter } from "next/navigation";


export interface topProps {
  influencerMode?: boolean;
}

export default function TopPage({ influencerMode }: topProps) {
  const [data, setData] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const authUser = useRecoilValue(authUserState);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("/api/auth/noti");
        setData(result.data?.data);
      } catch (e) {
        router.push('/logout')

      }

    };
    const fetchCompanyData = async () => {
      const result = await axios.get(
        `/api/company/aCompany?id=${authUser.user?.targetId}`
      );
      if (result.data) {
        setCompanyData(result.data)
      };
    };
    document.title = '管理画面TOP'
    fetchData();
    fetchCompanyData();
  }, [authUser]);
  const dateString = (dateValue: string) => {
    const date = new Date(dateValue);
    if (isNaN(date.getFullYear())) {
      return "";
    }
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    const formattedDate = `${year}年${month}月${day}日${hours}時${minutes}分`;

    return formattedDate;
  }
  return (
    <div className="bg-[white] px-[35px] sp:px-[12px] sp:text-small ">
      <div className="flex items-center py-[20px]  w-[full] border-b-[1px] border-[#DDDDDD] mt-[70px] sp:mt-[96px]">
        <span className="text-title sp:text-sptitle">管理画面TOP</span>
      </div>
      <div className="sp:w-[100%] mt-[55px] px-[30px] mobile:px-[0px] sp:px-[0px]">
        {!influencerMode && (
          <div className="border-b-[1px] border-[#DDDDDD] mx-[30px] mobile:mx-[10px]">
            {companyData?.active === 0 && <div className="p-[10px] mb-[10px] border-[1px] shadow-lg bg-[#ffdbd9] border-[#ffb0ab]">
              <div>
                利用期限：{dateString(companyData?.payment)}
              </div>
              <div>
                期限後はログインできなくなります。継続される場合は
                <span className="text-[#5bc4fc] cursor-pointer">
                  <Link href={'companyInfo'}>
                    こちら
                  </Link>
                </span>
                から。
              </div>
            </div>}
            <span className="text-header text-[#EE5736] ">重要なお知らせ</span>
            <div className="py-[30px]">
              {data?.mainNoti.split("\n")?.map((a, key) => (
                <div dangerouslySetInnerHTML={{ __html: a }} key={key} />
              ))}
            </div>
          </div>
        )}
        <div className="mx-[30px] mobile:mx-[10px] mt-[40px]">
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
