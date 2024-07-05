"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";
import Input from "@/components/atoms/input";
import Select from "@/components/atoms/select";
import axios from "axios";
import Modal from "../../utils/modal";
import { useRouter } from "next/navigation";
export interface InfluencerProps {
  influencerData?: InfluencerData;
  modalMode?: boolean;
  showButton?: boolean;
  onCancel?: () => void;
  handleApprove?: (val: string, cur?: number) => void;
}
interface InfluencerData {
  nickName?: string;
}

const InfluencerPage: React.FC<InfluencerProps> = ({
  influencerData,
  modalMode,
  showButton,
  onCancel,
  handleApprove,
}: InfluencerProps) => {
  const [data, setData] = useState(null);
  const [confirmMsg, setConfirmMsg] = useState('操作が成功しました。')
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  useEffect(() => {
    setData(influencerData);
    if (!modalMode) {
      document.title = influencerData.nickName;
    }
  }, [influencerData]);
  const handleUpdate = async (status) => {
    let update = data;
    if (status) {
      update = { ...data, status: status };
    }
    const emailAddress = data?.emailAddress;
    const mailFormat = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
    if (emailAddress === "") {
      setError("メールアドレスを入力してください。");
      return;
    }
    const regex = new RegExp(mailFormat);
    if (!regex.test(emailAddress)) {
      setError("メールアドレス形式で入力してください。");
      return;
    }
    const result = await axios.put("/api/influencer", update);
    if (result.data) {
      if (status) {
        let content = "";
        let subject = "";

        if (status === "否認") {
          content = `<div>
        ${data?.influencerName?.length ? data?.influencerName : data?.nickName} 様<br/>
        <br/>インフルエンサーめぐりに申請いただきありがとうございました。<br/>
        <br/>申請内容をもとに慎重に検討しました結果、
        <br/>今回は登録を見送らせていただくこととなりました。
        <br/>ご期待に沿えない結果となってしまい、申し訳ございません。
        <br/>またの機会がございましたら、よろしくお願いいたします。<br/>
        <br/>-----------------------------------------------------
        <br/>不明点がございましたらお問い合わせフォームよりご連絡ください。
        <br/>https://influencer-meguri.jp/ask

        `;
          subject = "【インフルエンサーめぐり】申請ありがとうございました";
        }
        if (status === "稼働中" || status === "稼動中") {
          content = `<div>
          ${data?.influencerName?.length ? data?.influencerName : data?.nickName} 様<br/>
        <br/>インフルエンサーめぐりに申請いただきありがとうございました。 
        <br/>登録が完了しましたのでログインしてサービスをご利用ください。 
        <br/>
        <br/>-----------------------------------------------------
        <br/>▼アカウント情報
        <br/>ログインURL：
        <br/>https://influencer-meguri.jp/login
        <br/>
        <br/>ID:
        <br/>${data?.emailAddress}<br/>
        <br/>パスワード：
        <br/>${result.data?.password}<br/>
        <br/>-----------------------------------------------------
        <br/>不明点がございましたらお問い合わせフォームよりご連絡ください。
        </div>https://influencer-meguri.jp/ask
        `;
          subject = "【インフルエンサーめぐり】登録が完了しました";
        }
        await axios.post("/api/sendEmail", {
          to: data?.emailAddress,
          subject: subject,
          html: content,
        });
      }
      if (result.data.type === 'error') {
        setConfirmMsg(result.data.msg ?? 'エラーが発生しました。');
      } else {
        setConfirmMsg('操作が成功しました。');
      }
      setError("");
      setShowConfirm(true);
    }
  };
  const className = modalMode ? "w-[90%]" : "w-[50%]";
  return (
    <div
      className={
        modalMode
          ? "text-center bg-[white]  px-[35px] p-[10px] sp:px-[12px] sp:text-small w-[40%] sp:w-[90%] m-auto relative shadow-lg "
          : "text-center bg-[white] px-[35px] p-[10px] sp:px-[12px] sp:text-small "
      }
    >
      <div
        className={
          showConfirm
            ? "bg-black bg-opacity-25 w-full h-full top-0 fixed left-0 overflow-auto duration-500"
            : "bg-black bg-opacity-25 w-full h-full top-0 fixed left-0 overflow-auto opacity-0 pointer-events-none duration-500"
        }
      >
        <Modal
          body={confirmMsg}
          onOk={() => {
            setShowConfirm(false)
            router.back();
          }
          }
          onCancel={() => setShowConfirm(false)}
        />
      </div>
      {!modalMode && (
        <div className="flex items-center py-[20px]  w-[full] border-b-[1px] border-[#DDDDDD] mt-[70px] sp:mt-[96px]">
          <span className="text-title sp:text-sptitle">{data?.nickName}</span>
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
      {!modalMode && <div
        className={`flex items-center py-[20px] sp:w-full m-auto border-b-[1px] border-[#DDDDDD] mt-[190px] sp:mt-[30px] sp:px-[18px] ${className}`}
      >
        <span
          className={
            modalMode
              ? "w-[35%] sp:w-[100px] pt-[20px] flex justify-end sp:justify-start  mr-[67px]"
              : "w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]"
          }
        >
          <span className="text-[#6F6F6F]">お名前</span>
        </span>
        <span>{data?.influencerName?.length > 0 && data?.influencerName !== 'null' ? data.influencerName : ""}</span>
      </div>}
      {!modalMode && <div
        className={`flex items-center py-[15px] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] ${className}`}
      >
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">名前ガーナ</span>
        </span>
        <span>{data?.influencerNameGana?.length > 0 && data?.influencerNameGana !== 'null' ? data.influencerNameGana : ""}</span>
      </div>}
      <div
        className={`flex items-center py-[15px] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] ${className}`}
      >
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">性別</span>
        </span>
        {data?.gender}
      </div>
      {!modalMode && <div
        className={`flex items-center py-[15px] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] ${className}`}
      >
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">ニックネーム</span>
        </span>
        <span>{data?.nickName}</span>
      </div>}
      {!modalMode && <div
        className={`flex items-center py-[15px] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] ${className}`}
      >
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">電話番号</span>
        </span>
        <span>{data?.phoneNumber}</span>
      </div>}
      {!modalMode && <div
        className={`flex py-[15px] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] ${className}`}
      >
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>メールアドレス</span>
        </span>

        <Input
          format="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
          formatMsg="メールアドレス形式ではありません"
          requireMsg="メールアドレスを入力してください。"
          handleChange={(val) => setData({ ...data, emailAddress: val })}
          inputClassName="max-w-[250px] grow border-[#D3D3D3] w-[100%]"
          value={data?.emailAddress}
        />

      </div>}
      <div
        className={`flex items-center py-[15px] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] ${className}`}
      >
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">都道府県</span>
        </span>
        <span>{data?.prefecture && data?.prefecture !== "null" ? data?.prefecture : ""}</span>
      </div>
      <div
        className={`flex  py-[15px] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] ${className}`}
      >
        <span className="w-[35%] mt-[5px] sp:w-[100px] flex  justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">ジャンル</span>
        </span>
        <div className="text-left">
          {data?.genre
            ? JSON.parse(data?.genre).map((a, key) => <div key={key}>{a}</div>)
            : ""}
        </div>
      </div>
      {data?.instagram && JSON.parse(data?.instagram).account !== "" && (
        <div
          className={`flex items-center py-[15px] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] ${className}`}
        >
          <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
            <span className="hover:cursor-pointer text-[#3F8DEB] underline underline-[#3F8DEB] underline-offset-[3px]">
              {data?.instagram ? (
                <a href={JSON.parse(data?.instagram).account} target="_blank">
                  Instagram
                </a>
              ) : (
                "Instagram"
              )}
            </span>
          </span>
          <span>{`フォロワー数：${data?.instagram ? JSON.parse(data?.instagram).followers : ""
            }`}</span>
        </div>
      )}
      {data?.x && JSON.parse(data?.x).account !== "" && (
        <div
          className={`flex items-center py-[15px] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] ${className}`}
        >
          <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
            <span className="hover:cursor-pointer text-[#3F8DEB] underline underline-[#3F8DEB] underline-offset-[3px]">
              {data?.x ? (
                <a href={JSON.parse(data?.x).account} target="_blank">
                  x
                </a>
              ) : (
                "x"
              )}
            </span>
          </span>
          <span>{`フォロワー数：${data?.x ? JSON.parse(data?.x).followers : ""
            }`}</span>{" "}
        </div>
      )}
      {data?.facebook && JSON.parse(data?.facebook).account !== "" && (
        <div
          className={`flex items-center py-[15px] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] ${className}`}
        >
          <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
            <span className="hover:cursor-pointer text-[#3F8DEB] underline underline-[#3F8DEB] underline-offset-[3px]">
              {data?.facebook ? (
                <a href={JSON.parse(data?.facebook).account} target="_blank">
                  facebook
                </a>
              ) : (
                "facebook"
              )}
            </span>
          </span>
          <span>{`フォロワー数：${data?.facebook ? JSON.parse(data?.facebook).followers : ""
            }`}</span>{" "}
        </div>
      )}
      {data?.tiktok && JSON.parse(data?.tiktok).account !== "" && (
        <div
          className={`flex items-center py-[15px] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] ${className}`}
        >
          <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
            <span className="hover:cursor-pointer text-[#3F8DEB] underline underline-[#3F8DEB] underline-offset-[3px]">
              {data?.tiktok ? (
                <a href={JSON.parse(data?.tiktok).account} target="_blank">
                  tiktok
                </a>
              ) : (
                "tiktok"
              )}
            </span>
          </span>
          <span>{`フォロワー数：${data?.tiktok ? JSON.parse(data?.tiktok).followers : ""
            }`}</span>{" "}
        </div>
      )}
      {data?.youtube && JSON.parse(data?.youtube).account !== "" && (
        <div
          className={`flex items-center py-[15px] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] ${className}`}
        >
          <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
            <span className="hover:cursor-pointer text-[#3F8DEB] underline underline-[#3F8DEB] underline-offset-[3px]">
              {data?.youtube ? (
                <a href={JSON.parse(data?.youtube).account} target="_blank">
                  youtube
                </a>
              ) : (
                "youtube"
              )}
            </span>
          </span>
          <span>{`フォロワー数：${data?.youtube ? JSON.parse(data?.youtube).followers : ""
            }`}</span>{" "}
        </div>
      )}
      {data?.otherSNS && data?.otherSNS !== "null" && (
        <div
          className={`flex items-center py-[15px] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] ${className}`}
        >
          <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
            <span className="text-[#6F6F6F]">その他</span>
          </span>
          <div>
            {data?.otherSNS
              ? data?.otherSNS
                .split("\n")
                ?.map((a, key) => <div key={key}>{a}</div>)
              : ""}
          </div>
        </div>
      )}
      {!modalMode && (
        <div
          className={`flex items-center py-[15px] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] ${className}`}
        >
          <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
            <span>登録日</span>
          </span>
          <div>{data?.date}</div>
        </div>
      )}
      {!modalMode && (
        <div
          className={`flex items-center py-[15px] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px] ${className}`}
        >
          <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
            <span>申請日時</span>
          </span>
          <div>2023/01/01 11:11</div>
        </div>
      )}
      {!modalMode && data?.status !== "承認待ち" && (
        <div className="flex items-center py-[15px] w-[50%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
          <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
            <span>状態</span>
          </span>
          <Select
            handleChange={(val) => setData({ ...data, status: val })}
            value={data?.status}
            selectClassName="w-[138px] border-[#D3D3D3]"
          >
            <option>稼動中</option>
            <option>停止中</option>
          </Select>
        </div>
      )}
      {!modalMode && data?.status === "承認待ち" && (
        <div className="flex items-center py-[15px] w-[50%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
          <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
            <span>状態</span>
          </span>
          <span>{data?.status}</span>
        </div>
      )}
      {error !== "" && (
        <div className="text-center m-[10px] text-[#EE5736]">{error}</div>
      )}
      {!modalMode && data?.status !== "承認待ち" && (
        <div className="flex justify-center mt-[36px] mb-[160px] sp:mb-[60px]">
          <Button
            buttonType={ButtonType.PRIMARY}
            handleClick={() => handleUpdate(data?.status)}
            buttonClassName="mr-[30px]"
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
          <Button
            handleClick={() => {
              router.back();
            }}
            buttonType={ButtonType.DEFAULT}
            buttonClassName="rounded-[5px]"
          >
            戻る
          </Button>
        </div>
      )}
      {!modalMode && data?.status === "承認待ち" && (
        <div className="flex justify-center mt-[45px] mb-[160px] sp:mb-[60px]">
          <Button
            buttonType={ButtonType.PRIMARY}
            handleClick={() => {
              // setData({ ...data, status: "稼働中" });
              handleUpdate("稼働中");
            }}
            buttonClassName="mr-[30px]"
          >
            <span className="flex items-center">
              <span>承認</span>
            </span>
          </Button>
          <Button
            buttonType={ButtonType.DANGER}
            handleClick={() => {
              // setData({ ...data, status: "稼働中" });
              handleUpdate("否認");
            }}
            buttonClassName="mr-[30px]"
          >
            <span className="flex items-center">
              <span>否認</span>
            </span>
          </Button>
          <Button
            handleClick={() => router.back()}
            buttonType={ButtonType.DEFAULT}
            buttonClassName="rounded-[5px]"
          >
            戻る
          </Button>
        </div>
      )}
      <div className="flex justify-center mt-[36px] pb-[30px] sp:mb-[60px]">
        {modalMode && showButton && <Button
          buttonType={ButtonType.PRIMARY}
          handleClick={() => handleApprove("承認")}
          buttonClassName="mr-[30px]"
        >
          <span className="flex items-center">
            <span>承認</span>
          </span>
        </Button>}
        {modalMode && showButton && <Button
          buttonType={ButtonType.DANGER}
          handleClick={() => handleApprove("否決")}
          buttonClassName="mr-[30px]"
        >
          <span className="flex items-center">
            <span>否認</span>
          </span>
        </Button>}
        {modalMode && <Button
          handleClick={() => onCancel()}
          buttonType={ButtonType.DEFAULT}
          buttonClassName="rounded-[5px]"
        >
          戻る
        </Button>}
      </div>
    </div>
  );
};
export default InfluencerPage;
