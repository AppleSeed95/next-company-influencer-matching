"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";
import TextArea from "@/components/atoms/textarea";
import Link from "next/link";
import axios from "axios";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Modal from "../../utils/modal";
const confirmMsg = "操作が成功しました。";
export interface ApplicatinProps {
  modalMode?: boolean;
  companyMode?: boolean;
  influencerDetailMode?: boolean;
  influencerMode?: boolean;
  caseID?: number;
  onCancel?: () => void;
}

const ApplicationPage: React.FC<ApplicatinProps> = ({
  modalMode,
  companyMode,
  influencerMode,
  influencerDetailMode,
  caseID,
  onCancel,
}: ApplicatinProps) => {
  const [data, setData] = useState(null);
  const [reason, setReason] = useState("");
  const [wantedSNS, setWantedSNS] = useState([]);
  const [error, setError] = useState("");
  const [valid, setValid] = useState(false);
  const { id } = useParams();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      let result;
      if (influencerMode) {
        result = await axios.get(`/api/case/aCase/?id=${caseID}`);
      } else {
        result = await axios.get(`/api/case/aCase/?id=${id}`);
      }
      if (result?.data.type === 'error') {
        setValid(false);
        if (!influencerMode && typeof window !== 'undefined') {
          router.push('/applicationList')
        }
      }
      else {
        setValid(true);
        setData(result.data);
        setReason(result.data.reason);
        setWantedSNS(JSON.parse(result.data.wantedSNS));
      }
    };

    fetchData();
  }, [caseID]);

  const apporove = (val: boolean) => {
    const approveApplication = async () => {
      const reason1 = val ? "" : reason;
      if (!val && reason === "") {
        setError("否認理由を入力してください");
        return;
      }
      const update = val ? "承認" : "否認";
      const result = await axios.put(`/api/case/aCase/?id=${id}`, {
        update,
        reason: reason1,
        approveMode: true,
      });
      if (result.data.type === "success") {
        if (update === "否認")
          await axios.post("/api/sendEmail", {
            to: data?.emailAddress,
            subject: "【インフルエンサーめぐり】募集案件を否認しました",
            content: `${data?.representativeName}様
          \n いつもインフルエンサーめぐりをご利用いただきありがとうございます。
          \n募集案件「 ${data.caseName} 」を否認しました。
          \n否認理由をご確認の上、再申請をお願いします。
          \n-----------------------------------------------------
          \n 不明点がございましたらお問い合わせフォームよりご連絡ください。
          \n http://localhost:3000/ask。
          `,
          });
        if (update === "承認")
          await axios.post("/api/sendEmail", {
            to: data?.emailAddress,
            subject: "【インフルエンサーめぐり】募集案件を承認しました",
            content: `${data?.representativeName}様
          \n いつもインフルエンサーめぐりをご利用いただきありがとうございます。
          \n募集案件「 ${data?.caseName} 」を承認しましたのでログインしてご確認ください。
          \n-----------------------------------------------------
          \n 不明点がございましたらお問い合わせフォームよりご連絡ください。
          \n http://localhost:3000/ask。
          `,
          });
        setShowConfirm(true);
        setError("");
      } else {
        setError("サーバーでエラーが発生しました。");
      }
    };
    approveApplication();
  };
  const widthClass = modalMode ? "" : "w-[40%]";
  const topClass = modalMode ? " pt-[50px]" : "";
  const dateString = (dateValue: string) => {
    const date = new Date(dateValue);
    if (isNaN(date.getFullYear())) {
      return "";
    }
    const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    return formattedDate;
  }
  if (!valid) return <></>
  return (
    <div
      className={
        modalMode
          ? "text-center bg-[white]  px-[35px] sp:px-[12px] sp:text-small w-[40%] sp:w-[90%] m-auto relative shadow-lg "
          : "text-center bg-[white] px-[35px] sp:px-[12px] sp:text-small "
      }
    >
      <div
        className={
          showConfirm
            ? "bg-black bg-opacity-25 w-full h-full fixed left-0 top-0 overflow-auto duration-500"
            : "bg-black bg-opacity-25 w-full h-full fixed left-0 top-0 overflow-auto opacity-0 pointer-events-none duration-500"
        }
      >
        <Modal
          body={confirmMsg}
          onOk={() => {
            setShowConfirm(false);
            router.back();
          }}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
      {!modalMode && (
        <div className="flex items-center py-[20px]  w-[full] border-b-[1px] border-[#DDDDDD] mt-[70px] sp:mt-[96px]">
          <span className="text-title sp:text-sptitle">{data?.caseName}</span>
        </div>
      )}
      {modalMode && (
        <button
          className="absolute bg-[#5E5E5E] text-[white] px-[15px] py-[10px] top-0 right-0 cursor-pointer"
          onClick={(e) => {
            if (onCancel) onCancel();
          }}
        >
          x
        </button>
      )}
      <div
        className={
          "flex items-center py-[20px] sp:w-full m-auto border-b-[1px] border-[#DDDDDD] mt-[90px] sp:mt-[30px] sp:px-[18px] " +
          widthClass +
          topClass
        }
      >
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">企業名</span>
        </span>
        {!modalMode && (
          <Link href={`/company/${data?.companyId}`}>
            <span className="text-[#3F8DEB] underline underline-[#3F8DEB] underline-offset-[3px]">
              {data?.companyName}
            </span>
          </Link>
        )}
        {modalMode && <span>{data?.companyName}</span>}
      </div>
      <div
        className={
          "flex items-center py-[15px]   sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] " +
          widthClass
        }
      >
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">案件種別</span>
        </span>
        <span>{data?.caseType}</span>
      </div>
      <div
        className={
          "flex items-center py-[20px]   sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] " +
          widthClass
        }
      >
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">案件名</span>
        </span>
        <span>{data?.caseName}</span>
      </div>
      <div
        className={
          "flex  py-[20px]   sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] " +
          widthClass
        }
      >
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">案件内容</span>
        </span>
        <div className="text-left">
          <span>{data?.caseContent}</span>
        </div>
      </div>

      <div
        className={
          "flex items-center py-[20px]   sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] " +
          widthClass
        }
      >
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">希望のハッシュタグ</span>
        </span>
        <span>{data?.wantedHashTag}</span>
      </div>
      <div
        className={
          "flex items-center py-[20px]   sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] " +
          widthClass
        }
      >
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">希望のSNS</span>
        </span>
        <div className="flex flex-wrap gap-[10px] items-center">
          {wantedSNS.includes("instagram") && (
            <img
              className="w-[35px]"
              src="/img/sns/Instagram.svg"
              alt="instagram"
            />
          )}
          {wantedSNS.includes("tiktok") && (
            <img className="w-[35px]" src="/img/sns/tiktok.svg" alt="tiktok" />
          )}
          {wantedSNS.includes("x") && (
            <img className="w-[35px]" src="/img/sns/x.svg" alt="x" />
          )}
          {wantedSNS.includes("youtube") && (
            <img
              className="w-[35px]"
              src="/img/sns/youtube.svg"
              alt="youtube"
            />
          )}
          {wantedSNS.includes("facebook") && (
            <img
              className="w-[35px]"
              src="/img/sns/facebook.svg"
              alt="youtube"
            />
          )}
          {wantedSNS.includes("etc.") && <span>etc.</span>}
        </div>
      </div>
      <div
        className={
          "flex items-center py-[20px]   sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] " +
          widthClass
        }
      >
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">来店場所 </span>
        </span>
        <span>{data?.casePlace}</span>
      </div>
      <div
        className={
          "flex items-center py-[20px]   sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] " +
          widthClass
        }
      >
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">募集期間 </span>
        </span>
        <span>
          {`${dateString(data?.collectionStart)} ~ ${dateString(data?.collectionEnd)}`}
        </span>
      </div>
      <div
        className={
          "flex items-center py-[20px]   sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] " +
          widthClass
        }
      >
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">案件終了日時 </span>
        </span>
        <span>{dateString(data?.caseEnd)}</span>
      </div>
      <div
        className={
          "flex items-center py-[20px]   sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] " +
          widthClass
        }
      >
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">募集人数 </span>
        </span>
        <span>{data?.collectionCnt}</span>
      </div>
      <div
        className={
          "flex  py-[20px]  sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] " +
          widthClass
        }
      >
        <span className="w-[35%] mb-[10px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">補足・注意事項 </span>
        </span>
        <div className="text-left">{data?.addition}</div>
      </div>
      {!modalMode && (
        <div
          className={
            "flex  py-[20px]  sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] " +
            widthClass
          }
        >
          <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
            <span className="text-[#6F6F6F]">否認理由 </span>
          </span>
          <TextArea
            value={data?.reason}
            textAreaClassName="max-w-[300px] h-[95px] grow border-[#D3D3D3] "
            placeholder="否決理由を入力してください。"
            handleChange={(val) => {
              setReason(val);
            }}
          />
        </div>
      )}
      {!modalMode && (
        <div
          className={
            "flex  py-[20px]  sp:w-full m-auto  sp:px-[18px] justify-end " +
            widthClass
          }
        >
          <div className="flex justify-center float-right">
            <span className="text-[#3F8DEB]">
              <Link href={"/"}>前回の申請内容を確認する</Link>
            </span>
            <img src="/img/triangle-right.svg" className="w-[11px] ml-[5px]" />
          </div>
        </div>
      )}
      {error !== "" && <div className="m-[10px] text-[#EE5736]">{error}</div>}
      {!modalMode && !(data?.status === '承認' || data?.status === '否認') &&
        (<div className="flex justify-center mt-[36px] mb-[160px] sp:mb-[60px]">
          <Button
            buttonType={ButtonType.PRIMARY}
            buttonClassName="mr-[30px]"
            handleClick={() => apporove(true)}
          >
            <span className="flex items-center">
              <span>承認</span>
              <img
                className="w-[14px] ml-[5px]"
                src="/img/approve.svg"
                alt="approve"
              />
            </span>
          </Button>
          <Button
            buttonType={ButtonType.DANGER}
            buttonClassName="mr-[30px]"
            handleClick={() => apporove(false)}
          >
            <span className="flex items-center">
              <span>否認</span>
              <img
                className="w-[14px] ml-[5px]"
                src="/img/cross.svg"
                alt="cross"
              />
            </span>
          </Button>
          <Button
            buttonType={ButtonType.DEFAULT}
            buttonClassName="rounded-[5px]"
            handleClick={() => router.back()}
          >
            戻る
          </Button>
        </div>)}

      {modalMode && influencerMode && !influencerDetailMode && (
        <Button
          handleClick={() => {
            if (onCancel) onCancel();
          }}
          buttonType={ButtonType.PRIMARY}
          buttonClassName="m-[30px]"
        >
          <span className="flex items-center">
            <span>確認</span>
          </span>
        </Button>
      )}
      {modalMode && companyMode && (
        <Button
          buttonType={ButtonType.PRIMARY}
          buttonClassName="m-[30px]"
          handleClick={() => {
            if (onCancel) onCancel();
          }}
        >
          <span className="flex items-center">
            <span>確認</span>
          </span>
        </Button>
      )}
    </div>
  );
};
export default ApplicationPage;
