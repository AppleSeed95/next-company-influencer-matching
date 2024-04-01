"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";
import Checkbox from "@/components/atoms/checkbox";
import Input from "@/components/atoms/input";
import Select from "@/components/atoms/select";
import { useRouter } from "next/navigation";
import axios from "axios";
import Modal from "../../utils/modal";
export interface CompanyProps {
  companyData?: CompanyData;
}
interface CompanyData {
  companyName?: string;
  // Add other properties as needed
}
const confirmMsg = "操作が成功しました。";
const CompanyPage: React.FC<CompanyProps> = ({ companyData }: CompanyProps) => {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    setData(companyData);
    document.title = companyData?.companyName;
  }, [companyData]);
  const handleUpdate = async () => {
    const emailAddress = data?.emailAddress;
    const monthlyCollectionCnt = data?.monthlyCollectionCnt;
    const concurrentCollectionCnt = data?.concurrentCollectionCnt;
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

    if (!(monthlyCollectionCnt > 0)) {
      setError('月の募集数を入力してください。')
      return;
    }
    if (!(concurrentCollectionCnt > 0)) {
      setError('同時募集数を入力してください。')
      return;
    }
    const result = await axios.put("/api/company", data);
    if (result.data.type === "success") {
      setShowConfirm(true);
      setError("")
    }
  };
  const dateString = (dateValue: string) => {
    const date = new Date(dateValue);
    if (isNaN(date.getFullYear())) {
      return "";
    }
    const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    return formattedDate;
  }
  return (
    <div className="text-center bg-[white] px-[35px] sp:px-[12px] sp:text-small ">
      <div
        className={
          showConfirm
            ? "bg-black bg-opacity-25 w-full h-full fixed top-0 left-0 overflow-auto duration-500"
            : "bg-black bg-opacity-25 w-full h-full fixed top-0 left-0 overflow-auto opacity-0 pointer-events-none duration-500"
        }
      >
        <Modal
          body={confirmMsg}
          onOk={() => setShowConfirm(false)}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
      <div className="flex items-center py-[20px]  w-[full] border-b-[1px] border-[#DDDDDD] mt-[70px] sp:mt-[96px]">
        <span className="text-title sp:text-sptitle">{data?.companyName}</span>
      </div>
      <div className="flex items-center py-[20px] w-[50%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD] mt-[90px] sp:mt-[30px]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">企業名</span>
        </span>
        <span>{data?.companyName}</span>
      </div>
      <div className="flex items-center py-[20px] w-[50%]  sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">企業名カナ</span>
        </span>
        <span>{data?.companyNameGana}</span>
      </div>
      <div className="flex items-center py-[20px] w-[50%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">代表者名</span>
        </span>
        <span>{data?.representativeName}</span>
      </div>
      <div className="flex items-center py-[20px] w-[50%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">代表者名カナ</span>
        </span>
        <span>{data?.representativeNameGana}</span>
      </div>
      <div className="flex items-center py-[20px] w-[50%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">担当者名</span>
        </span>
        <span>{data?.responsibleName}</span>
      </div>
      <div className="flex items-center py-[20px] w-[50%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">担当者名カナ</span>
        </span>
        <span>{data?.responsibleNameGana}</span>
      </div>
      <div className="flex items-center py-[20px] w-[50%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">WEBサイト</span>
        </span>
        <span>{data?.webSite}</span>
      </div>
      <div className="flex items-center py-[20px] w-[50%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">電話番号</span>
        </span>
        <span>{data?.phoneNumber}</span>
      </div>
      <div className="flex py-[20px] w-[50%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>メールアドレス</span>
        </span>
        <Input
          inputClassName="max-w-[250px] grow border-[#D3D3D3] w-[100%]"
          format="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
          formatMsg="メールアドレス形式ではありません"
          requirMsg="メールアドレスを入力してください。"
          value={data?.emailAddress}
          handleChange={(val) => setData({ ...data, emailAddress: val })}
        />
      </div>
      <div className="flex items-center py-[20px] w-[50%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">郵便番号</span>
        </span>
        <span>{data?.postalCode}</span>
      </div>
      <div className="flex items-center py-[20px] w-[50%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">住所</span>
        </span>
        <span>{`${data?.address} - ${data?.building}`}</span>
      </div>
      <div className="flex items-center py-[20px] w-[50%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">決済</span>
        </span>
        {/* <span>{data?.payment.length > 0 ? data.payment?.substring(0, 10) + '日まで' : ''}</span> */}
        <span>{dateString(data?.payment)}</span>
      </div>
      <div className="flex items-center py-[20px] w-[50%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">決済失敗</span>
        </span>
        <span>{data?.paymentFailed}</span>
      </div>
      <div className="flex items-center py-[20px] w-[50%]  sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">登録日</span>
        </span>
        <span>{data?.date}</span>
      </div>
      <div className="flex items-center py-[20px] w-[50%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>状態</span>
        </span>
        <Select
          selectClassName="w-[138px] border-[#D3D3D3]"
          value={data?.status}
          handleChange={(val) => setData({ ...data, status: val })}
        >
          <option value={"稼動中"}>稼動中</option>
          <option value={"停止中"}>停止中</option>
          <option value={"退会"}>退会</option>
        </Select>
      </div>
      <div className="flex  py-[20px] w-[50%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]  sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>月の募集数</span>
        </span>
        <Input
          type={"number"}
          format="n"
          formatMsg="月の募集数は半角数字で入力してください。"
          requirMsg="月の募集数を入力してください。"
          inputClassName="w-[170px] border-[#D3D3D3]"
          value={data?.monthlyCollectionCnt}
          handleChange={(val) => {
            const valNumber = val === '' ? 0 : val
            setData({ ...data, monthlyCollectionCnt: valNumber })
          }
          }
        />
      </div>
      <div className="flex  py-[20px] w-[50%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>同時募集数</span>
        </span>
        <Input
          type={"number"}
          format="n"
          formatMsg="同時募集数は半角数字で入力してください。"
          requirMsg="同時募集数を入力してください。"
          inputClassName="w-[170px] border-[#D3D3D3]"
          value={data?.concurrentCollectionCnt}
          handleChange={(val) => {
            const valNumber = val === '' ? 0 : val
            setData({ ...data, concurrentCollectionCnt: valNumber })
          }
          }
        />
      </div>
      <div className="flex items-center py-[20px] w-[50%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>プラン</span>
        </span>
        <Select
          selectClassName="w-[138px] border-[#D3D3D3]"
          value={data?.plan}
          handleChange={(val) => setData({ ...data, plan: val })}
        >
          <option value={"月1プラン"}>月1プラン</option>
          <option value={"月2プラン"}>月2プラン</option>
          <option value={"月3プラン"}>月3プラン</option>
        </Select>
      </div>
      <div className="flex items-center py-[20px] w-[50%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>無料アカウント</span>
        </span>
        <Checkbox
          value={data?.freeAccount === 1}
          handleChange={(val) => setData({ ...data, freeAccount: val })}
        />
      </div>
      {error !== "" && (
        <div className="text-center m-[10px] text-[#EE5736]">{error}</div>
      )}
      <div className="flex items-center justify-center mt-[36px] mb-[160px] sp:mb-[60px]">
        <Button
          buttonType={ButtonType.PRIMARY}
          buttonClassName="mr-[30px]"
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
        <Button
          buttonType={ButtonType.PRIMARYDEFAULT}
          buttonClassName="rounded-[5px] px-[20px] py-[10px]"
          handleClick={() => router.back()}
        >
          戻る
        </Button>
      </div>
    </div>
  );
};
export default CompanyPage;
