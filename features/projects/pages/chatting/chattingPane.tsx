"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";
import TextArea from "@/components/atoms/textarea";
import io from "socket.io-client";
import { useRecoilValue } from "recoil";
import { authUserState } from "@/recoil/atom/auth/authUserAtom";
import { useParams } from "next/navigation";
import axios from "@/node_modules/axios/index";

const socket = io("https://influencer-meguri.jp");
import Image from "next/image";
import ChattingRooms from "./rooms";

export default function ChattingPane() {
  const user = useRecoilValue(authUserState);
  const [data, setData] = useState([]);
  const [roomData, setRoomData] = useState(null);
  const [reload, setReload] = useState(false);
  const [showRooms, setShowRooms] = useState(false);
  const [reset, setReset] = useState(false);
  const [msg, setMsg] = useState("");
  const { id } = useParams();
  useEffect(() => {
    socket.on("message", () => {
      setReload(!reload);
    });

    socket.emit("info", { roomId: id });
    const fetchData = async () => {
      const result = await axios.get(`/api/chatting?id=${id}`);
      if (result.data?.length) {
        setData(result.data);
      }
    };
    const fetchRoomData = async () => {
      const result = await axios.get(`/api/chatting/chattingRoom?id=${id}`);
      if (result.data) {
        setRoomData(result.data);
      }
    };
    fetchData();
    fetchRoomData();
  }, [reload]);
  useEffect(() => {
    const pane = document.getElementById("pane");
    pane.scrollTop = pane.scrollHeight;
  }, [data]);
  const handleSendMsg = async () => {
    if (msg === "") {
      return;
    }
    setMsg("");
    if (user.user.role === "企業") {
      await axios.post("/api/sendEmail", {
        to: roomData?.infEmail,
        subject: "【【インフルエンサーめぐり】チャットが届きました",
        content: `${roomData?.influencerName} 様。
          \n いつもインフルエンサーめぐりをご利用いただきありがとうございます。
          \n以下の案件からチャットが届いてます。
          \nログインしてご確認をお願いします。
          \n
          \n企業名：${roomData?.companyName}
          \n案件名：${roomData?.caseName}
          \nURL ：https://localhost:3000/chattingInf/${id}
          \n
          \n-----------------------------------------------------
          \n 不明点がございましたらお問い合わせフォームよりご連絡ください。
          \n http://localhost:3000/ask。
          `,
      });
    }
    if (user.user.role !== "企業") {
      await axios.post("/api/sendEmail", {
        to: roomData?.companyEmail,
        subject: "【インフルエンサーめぐり】チャットが届きました",
        content: `${roomData?.representativeName} 様。
          \n いつもインフルエンサーめぐりをご利用いただきありがとうございます。
          \n以下の案件でチャットが届いてます。
          \nログインしてご確認をお願いします。
          \n
          \n案件名：${roomData?.caseName}
          \nインフルエンサー名：${roomData?.influencerName}
          \nURL ：https://localhost:3000/chatting/${id}
          \n
          \n-----------------------------------------------------
          \n 不明点がございましたらお問い合わせフォームよりご連絡ください。
          \n http://localhost:3000/ask。
          `,
      });
    }
    socket.emit("message", { roomId: id, userId: user.user.id, msg });
    setReset(!reset);
  };
  let day = "";
  return (
    <div>
      <div className="absolute lg:hidden  right-[20px] top-[180px]">
        <Image
          alt="hamburger"
          width={70}
          height={70}
          src="/img/hamburger.svg"
          className="h-[14px] mx-[22px]"
          onClick={() => {
            setShowRooms(!showRooms);
          }}
        />
      </div>
      <div
        className={
          showRooms
            ? "lg:hidden opacity-100 "
            : "lg:hidden hidden  duration-200"
        }
      >
        <ChattingRooms />
      </div>

      <div
        className="h-[590px] bg-[#F8F9FA] pt-[100px] overflow-y-auto scroll-smooth"
        id="pane"
      >
        {data.map((aData, idx) => {
          let showDay = aData.day !== day;
          if (showDay) day = aData.day;

          return [
            showDay && (
              <div key={"1"} className="w-full text-center  mb-[30px] ">
                <span className="text-[white] rounded-[15px] bg-[#DEDEDE] px-[12px] py-[5px]">
                  {aData.day}
                </span>
              </div>
            ),
            aData.userId === user.user.id ? (
              <div className="flex flex-col" key={idx}>
                <div className="w-full sp:mt-[30px] my-[20px]">
                  <div className="chat-me relative float-right mr-[65px] sp:mx-[10px] inline-block bg-[#DEDEDE] px-[20px] py-[15px] rounded-[15px] shadow-sm border-[1px] border-[#DDDDDD]">
                    {aData.msg.split("\n")?.map((a, key) => (
                      <div key={key}>{a}</div>
                    ))}
                    <div className="absolute bottom-[-30px] right-0 text-[#A8A8A8]">
                      {aData.time}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div key={idx}>
                <div className="chat-you relative ml-[65px] my-[30px] sp:mx-[10px] inline-block bg-[white] px-[20px] py-[15px] rounded-[15px] shadow-sm">
                  <div className="absolute top-[-30px]">{aData.name}</div>
                  {aData.msg.split("\n")?.map((a, key) => (
                    <div key={key}>{a}</div>
                  ))}
                  <div className="absolute bottom-[-30px] right-0 text-[#A8A8A8]">
                    {aData.time}
                  </div>
                </div>
              </div>
            ),
          ];
        })}
      </div>
      <div className="h-[130px] flex items-center justify-between border-t-[1px] border-[#DDDDDD]">
        <TextArea
          handleCtrlEnter={() => handleSendMsg()}
          reset={reset}
          placeholder="メッセージを入力"
          textAreaClassName="h-[120px] border-0 grow"
          handleChange={(val) => setMsg(val)}
          value={msg}
        />
        <Button
          handleClick={handleSendMsg}
          buttonType={ButtonType.ROUNDED}
          buttonClassName="mx-[30px] w-[45px] h-[45px]"
        >
          <img src="/img/apply.svg" alt="apply" />
        </Button>
      </div>
    </div>
  );
}
