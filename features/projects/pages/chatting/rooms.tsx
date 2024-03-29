"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRecoilValue } from "recoil";
import { authUserState } from "@/recoil/atom/auth/authUserAtom";
import axios from "axios";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
const ChattingRooms: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const user = useRecoilValue(authUserState);
  const [data, setData] = useState([]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(
        `/api/chatting/room?id=${user.user.targetId}&type=${user.user.role === "企業" ? "company" : "influencer"
        }`
      );
      if (result.data.length) {
        setData(result.data);
        if (!id) {
          if (typeof window !== "undefined") {
            router.push(`/chattingInf/${result.data[0].applyId}`);
          }
        }
        result.data.map((a, key) => {
          if (a.applyId == id) {
            setActive(key);
          }
        });
      }
    };
    fetchData();
  }, []);
  return (
    <div
      id="parent"
      className="h-full bg-[white] z-10 border-[1px] border-[#DDDDDD] w-[100%] sp:w-[180px] sp:fixed sp:h-full sp:left-[0px] sp:top-[0px] overflow-y-auto overflow-x-show"
    >
      {data?.map((aData, key) => (
        <Link
          key={key}
          href={
            user.user.role === "企業"
              ? `/chatting/${aData.applyId}`
              : `/chattingInf/${aData.applyId}`
          }
        >
          <div>
            <div
              onClick={() => setActive(key)}
              className={
                key === active
                  ? "w-full border-b-[1px] border-[#DDDDDD] bg-[#CCCCCC] px-[36px] py-[30px] duration-500"
                  : "w-full border-b-[1px] border-[#DDDDDD] px-[36px] py-[30px] duration-500"
              }
              id={key === active ? "active" : `room${key}`}
            >
              <div className="font-bold text-[14px]">{aData.caseName}</div>
              {user.user.role === "企業"
                ? aData.influencerName
                : aData.companyName}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
export default ChattingRooms;
