"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";
import Input from "@/components/atoms/input";
import Checkbox from "@/components/atoms/checkbox";
import { useRecoilValue } from "recoil";
import { authUserState } from "@/recoil/atom/auth/authUserAtom";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Modal from "../../utils/modal";
import CheckoutPage from "./stripe";
import AppyExpired from "./applyExpired";

export interface CompanyInfoProps {
  applyMode?: boolean;
}
const CompanyInfoPage: React.FC<CompanyInfoProps> = ({
  applyMode,
}: CompanyInfoProps) => {
  const authUser = useRecoilValue(authUserState);
  const [showConfirm, setShowConfirm] = useState(false);
  const [active, setActive] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    companyName: "",
    companyNameGana: "",
    representativeName: "",
    representativeNameGana: "",
    responsibleName: "",
    responsibleNameGana: "",
    webSite: "",
    phoneNumber: "",
    emailAddress: "",
    postalCode: "",
    address: "",
    payment: "",
    building: "",
    date: "",
    status: "",
    paymentCnt: 0,
    plan: 0,
    priceID: '',
    userId: 0,
  });
  const msgs = {
    companyName: "企業名を入力してください",
    companyNameGana: "企業名カナを入力してください",
    representativeName: "代表者名を入力してください",
    representativeNameGana: "代表者名カナを入力してください",
    responsibleName: "担当者名を入力してください",
    responsibleNameGana: "担当者名カナを入力してください",
    webSite: "WEBサイトのURLを入力してください",
    phoneNumber: "電話番号を入力してください ",
    emailAddress: "メールアドレスを入力してください  ",
    postalCode: "郵便番号を入力してください",
    address: "住所を入力してください",
  };
  const [error, setError] = useState([]);
  const [expired, setExpired] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const applyId = searchParams.get('id');
  const [confirmMsg, setConfirmMsg] = useState('操作が成功しました。')
  const fetchData = async () => {
    try {
      const result = await axios.get(
        `/api/company/aCompany?id=${authUser.user?.targetId}`
      );

      if (result.data) {
        setData(result.data)
        setActive(result.data.active);
      };
    } catch (e) {
      router.push('logout')
    }

  };
  useEffect(() => {
    const getAppliedUserData = async () => {
      const result = await axios.get(`/api/user?id=${applyId}`);
      if (result.data.type === 'error') {
        setExpired(true);
      }
      else {
        const applyTime = new Date(result.data.applyTime);
        const currentTime = new Date(result.data.current);
        const timeDiff = currentTime.getTime() - applyTime.getTime();
        const minutesDiff = timeDiff / (1000 * 60);
        if (minutesDiff > 60) {
          await axios.delete(`/api/user?id=${applyId}`);
          setExpired(true);
        }
      }
    }
    if (!applyMode && authUser) {
      fetchData();
      document.title = '企業情報変更';
    };
    if (applyMode && applyId) {
      getAppliedUserData();
    }
  }, []);
  const handleApply = async (isApply) => {
    if (isLoading) return;
    const keys = Object.keys(msgs);
    let isValid = true;
    let ErrorList = [];
    keys.forEach((aKey) => {
      if (data[aKey] === "") {
        ErrorList.push(msgs[aKey]);
        isValid = false;
      }
    });
    let phonePattern = /^0\d{1,4}-\d{1,4}-\d{4}$/;
    if (data.phoneNumber.trim() !== '' && !phonePattern.test(data.phoneNumber.trim())) {

      ErrorList.push('電話番号形式ではありません');
      isValid = false;
    }
    let mailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (data.emailAddress.trim() !== '' && !mailPattern.test(data.emailAddress.trim())) {
      ErrorList.push('メールアドレス形式ではありません');
      isValid = false;
    }
    let postalCodePattern = /^\d{3}-\d{4}$/;
    if (data.postalCode.trim() !== '' && !postalCodePattern.test(data.postalCode.trim())) {
      ErrorList.push('郵便番号形式ではありません');
      isValid = false;
    }
    if (!agree && applyMode) {
      ErrorList.push('個人情報の取り扱いに同意する必要があります。');
      isValid = false;
    }
    if (!isValid) {
      setError(ErrorList);
      return;
    }
    setIsLoading(true);
    if (isApply) {
      const res = await axios.post(`api/company`, data);

      if (res.data.type === "success") {
        await axios.post("/api/sendEmail", {
          from: data.emailAddress,
          subject: "【インフルエンサーめぐり】登録がありました",
          content: `インフルエンサーめぐりに登録がありました。
            \n
            \n---------------------------------------------
            \n ▼登録情報
            \n企業名          ：${data.companyName}
            \n企業名カナ      ：${data.companyNameGana}
            \n代表者名        ：${data.representativeName}
            \n代表者名カナ    ：${data.representativeName}
            \n担当者名        ：${data.responsibleName}
            \n担当者名カナ    ：${data.responsibleNameGana}
            \nWEBサイト       ：${data.webSite}
            \n電話番号        ：${data.phoneNumber}
            \nメールアドレス   ：${data.emailAddress}
            \n郵便番号         ：${data.postalCode}
            \n住所             ：${data.address} ${data.building ? data.building : ""
            }
            \n
            \n-----------------------------------------------------
            `,
        });
        await axios.post("/api/sendEmail", {
          to: data.emailAddress,
          subject: "【インフルエンサーめぐり】ご登録ありがとうございます",
          content: `${data.responsibleName} 様
            \n
            \n インフルエンサーめぐりにご登録いただきありがとうございます。
            \nログインしてサービスをご利用ください。
            \n
            \n---------------------------------------------
            \n▼アカウント情報
            \nログインURL：
            \nhttps://influencer-meguri.jp
            \nID：
            \n${data.emailAddress}
            \nパスワード：
            \n${res.data.password}
            \n
            \n---------------------------------------------
            \nログイン後に決済手続きをお願いします。
            \n決済完了後にサービスのご利用ができます。
            \n
            \n-----------------------------------------------------
            \n不明点がございましたらお問い合わせフォームよりご連絡ください。
            \nhttps://influencer-meguri.jp/ask
            `,
        });
        if (typeof window !== "undefined") {
          router.push("/applyComplete");
        }
      } else {
        setError(["メールアドレスが登録されていません。"])
      }
    }
    if (!isApply) {
      const res = await axios.put(`api/company`, data);
      if (res.data.type === 'success') {
        setConfirmMsg('操作が成功しました。');
        setError([]);
        setShowConfirm(true);
      }
      else {
        setConfirmMsg(res.data.msg);
        setShowConfirm(true);
      }
    }
    setIsLoading(false);
  };
  const handlePaymentInfoChange = () => {
    setShowPayment(true);
  }
  if (applyMode && (!applyId || expired)) {
    return (
      <div className="flex grow min-h-full">
        <AppyExpired />
      </div>
    )
  }
  const handleUpdateAccount = async (val) => {
    const res = await axios.put(`/api/auth?id=${data?.userId}`, { val: val });
    if (res.data.type === 'success') {
      setConfirmMsg('操作が成功しました。');
      setShowConfirm(true);
      fetchData();
    }
  }
  return (
    <div
      className={
        applyMode
          ? "text-center px-[35px] sp:px-[12px] sp:text-small pt-[200px] w-full"
          : "text-center px-[35px] sp:px-[12px] sp:text-small bg-[white] w-full"
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
          onOk={() => setShowConfirm(false)}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
      <div
        className={
          showPayment
            ? "bg-black bg-opacity-25 w-full h-full fixed left-0 top-0 overflow-auto duration-500"
            : "bg-black bg-opacity-25 w-full h-full fixed left-0 top-0 overflow-auto opacity-0 pointer-events-none duration-500"
        }
      >
        <Modal
          noFooter
          body={<CheckoutPage priceID={data?.priceID} />}
          onOk={() => setShowPayment(false)}
          onCancel={() => setShowPayment(false)}
        />
      </div>
      {!applyMode && (
        <div className="flex  py-[20px]  w-[full] border-b-[1px] border-[#DDDDDD] mt-[70px] mb-[50px] sp:mt-[96px]">
          <span className="text-title sp:text-sptitle">企業情報変更</span>
        </div>
      )}
      <div className="flex  pt-[15px] pb-[5px] w-[40%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>企業名</span>
          {<span className="ml-[10px] text-[#EE5736] text-[11px]">必須</span>}
        </span>
        <Input
          requirMsg={msgs.companyName}
          inputClassName="max-w-[250px] grow border-[#D3D3D3] w-[100%]"
          value={data?.companyName}
          handleChange={(val) => {
            setData({ ...data, companyName: val });
          }}
        />
      </div>
      <div className="flex  pt-[15px] pb-[5px] w-[40%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>企業名カナ</span>
          {<span className="ml-[10px] text-[#EE5736] text-[11px]">必須</span>}
        </span>
        <Input
          inputClassName="max-w-[250px] grow border-[#D3D3D3] w-[100%]"
          value={data?.companyNameGana}
          requirMsg={msgs.companyNameGana}
          handleChange={(val) => {
            setData({ ...data, companyNameGana: val });
          }}
        />
      </div>
      <div className="flex  pt-[15px] pb-[5px] w-[40%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>代表者名</span>
          {<span className="ml-[10px] text-[#EE5736] text-[11px]">必須</span>}
        </span>
        <Input
          inputClassName="max-w-[250px] grow border-[#D3D3D3] w-[100%]"
          value={data?.representativeName}
          requirMsg={msgs.representativeName}
          handleChange={(val) => {
            setData({ ...data, representativeName: val });
          }}
        />
      </div>
      <div className="flex  pt-[15px] pb-[5px] w-[40%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>代表者名カナ</span>
          {<span className="ml-[10px] text-[#EE5736] text-[11px]">必須</span>}
        </span>
        <Input
          inputClassName="max-w-[250px] grow border-[#D3D3D3] w-[100%]"
          value={data?.representativeNameGana}
          requirMsg={msgs.representativeNameGana}
          handleChange={(val) => {
            setData({ ...data, representativeNameGana: val });
          }}
        />
      </div>
      <div className="flex  pt-[15px] pb-[5px] w-[40%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>担当者名</span>
          {<span className="ml-[10px] text-[#EE5736] text-[11px]">必須</span>}
        </span>
        <Input
          inputClassName="max-w-[250px] grow border-[#D3D3D3] w-[100%]"
          value={data?.responsibleName}
          requirMsg={msgs.responsibleName}
          handleChange={(val) => {
            setData({ ...data, responsibleName: val });
          }}
        />
      </div>
      <div className="flex  pt-[15px] pb-[5px] w-[40%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>担当者名カナ</span>
          {<span className="ml-[10px] text-[#EE5736] text-[11px]">必須</span>}
        </span>
        <Input
          requirMsg={msgs.responsibleNameGana}
          inputClassName="max-w-[250px] grow border-[#D3D3D3] w-[100%]"
          value={data?.responsibleNameGana}
          handleChange={(val) => {
            setData({ ...data, responsibleNameGana: val });
          }}
        />
      </div>
      <div className="flex  pt-[15px] pb-[5px] w-[40%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>WEBサイト</span>
          {<span className="ml-[10px] text-[#EE5736] text-[11px]">必須</span>}
        </span>
        <Input
          requirMsg={msgs.webSite}
          inputClassName="max-w-[250px] grow border-[#D3D3D3] w-[100%]"
          value={data?.webSite}
          handleChange={(val) => {
            setData({ ...data, webSite: val });
          }}
        />
      </div>
      <div className="flex  pt-[15px] pb-[5px] w-[40%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>電話番号</span>
          {<span className="ml-[10px] text-[#EE5736] text-[11px]">必須</span>}
        </span>
        <Input
          inputClassName="max-w-[250px] grow border-[#D3D3D3] w-[100%]"
          value={data?.phoneNumber}
          requirMsg={msgs.phoneNumber}
          format="^0\d{1,4}-\d{1,4}-\d{4}$"
          formatMsg="電話番号形式ではありません"
          handleChange={(val) => {
            setData({ ...data, phoneNumber: val });
          }}
        />
      </div>
      <div className="flex  pt-[15px] pb-[5px] w-[40%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>メールアドレス</span>
          {<span className="ml-[10px] text-[#EE5736] text-[11px]">必須</span>}
        </span>
        <Input
          inputClassName="max-w-[250px] grow border-[#D3D3D3] w-[100%]"
          value={data?.emailAddress}
          requirMsg={msgs.emailAddress}
          format="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
          formatMsg="メールアドレス形式ではありません。"
          handleChange={(val) => {
            setData({ ...data, emailAddress: val });
          }}
        />
      </div>
      <div className="flex  pt-[15px] pb-[5px] w-[40%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>郵便番号</span>
          {<span className="ml-[10px] text-[#EE5736] text-[11px]">必須</span>}
        </span>
        <Input
          inputClassName="max-w-[250px] grow border-[#D3D3D3] w-[100%]"
          value={data?.postalCode}
          requirMsg={msgs.postalCode}
          format="^\d{3}-\d{4}$"
          formatMsg="郵便番号形式ではありません"
          handleChange={(val) => {
            setData({ ...data, postalCode: val });
          }}
        />
      </div>
      <div className="flex  pt-[15px] pb-[5px] w-[40%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>住所</span>
          {<span className="ml-[10px] text-[#EE5736] text-[11px]">必須</span>}
        </span>
        <Input
          inputClassName="max-w-[250px] grow border-[#D3D3D3] w-[100%]"
          value={data?.address}
          requirMsg={msgs.address}
          handleChange={(val) => {
            setData({ ...data, address: val });
          }}
        />
      </div>
      <div className="flex  py-[15px]  w-[40%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>建物</span>
          {
            <span className="ml-[10px] text-[#EE5736] text-[11px] invisible">
              必須
            </span>
          }
        </span>
        <Input
          notRequired
          inputClassName="max-w-[250px] grow border-[#D3D3D3] w-[100%]"
          value={data?.building}
          handleChange={(val) => {
            setData({ ...data, building: val });
          }}
        />
      </div>
      {!applyMode && (
        <div className="flex  py-[15px]  w-[40%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
          <span className="w-[35%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
            <span>決済</span>
          </span>
          <div className="sp:text-center">
            <span>{data?.payment.length > 0 ? data.payment?.substring(0, 10) + '日まで' : ''}</span>
            <Button
              buttonType={ButtonType.DANGER}
              buttonClassName="ml-[40px] sp:ml-[0px]"
              handleClick={handlePaymentInfoChange}
            >
              決済情報変更
            </Button>
          </div>
        </div>
      )}
      {!applyMode && (
        <div className="flex items-center py-[15px]  w-[40%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
          <span className="w-[35%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
            <span>登録日</span>
          </span>
          <div>
            <span>{data?.date}</span>
          </div>
        </div>
      )}
      {!applyMode && (
        <div className="flex  items-center py-[15px]  w-[40%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
          <span className="w-[35%]  sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
            <span>状態</span>
          </span>
          <div>
            <span>{data?.status}</span>
          </div>
        </div>
      )}
      {applyMode && <div className="flex justify-center">
        <Checkbox
          prefix={""}
          value={agree}
          checkBoxClassName="mt-[36px]"
          title={
            <span>
              <span className="underline decoration-[#353A40] underline-offset-[5px]">
                個人情報の取り扱い
              </span>
              に同意します
            </span>
          }
          handleChange={(isChecked) => {
            setAgree(isChecked);
          }}
        />
      </div>}
      {error.length > 0 && error.map((aError, idx) => (
        <div key={idx} className="text-center m-[10px] text-[#EE5736]">{aError}</div>
      ))
      }
      {applyMode ? (
        <div className="flex justify-center mt-[36px] mb-[160px] sp:mb-[60px]">
          <Button
            buttonType={ButtonType.PRIMARY}
            handleClick={() => handleApply(true)}
          >
            <span className="flex ">
              <div className="flex items-center">
                {isLoading ? (
                  <img
                    src="/img/refresh.svg"
                    alt="rotate"
                    className="mr-[5px] rotate"
                  />
                ) : (
                  ""
                )}
                送信する
              </div>
            </span>
          </Button>
        </div>
      ) : (
        <div className="flex justify-center mt-[36px] mb-[160px] sp:mb-[60px]">
          <Button
            buttonType={ButtonType.PRIMARY}
            buttonClassName="mr-[30px]"
            handleClick={() => handleApply(false)}
          >
            <span className="flex ">
              <span>更新</span>
              <img
                className={
                  isLoading ? "w-[14px] ml-[5px] rotate" : "w-[14px] ml-[5px]"
                }
                src="/img/refresh.svg"
                alt="refresh"
              />
            </span>
          </Button>
          {(data?.paymentCnt >= 6 && active === 1) && < Button buttonType={ButtonType.PRIMARY} buttonClassName="mr-[30px]"
            handleClick={() => handleUpdateAccount(false)}
          >
            <span className="flex ">
              <span>解約</span>
            </span>
          </Button>}
          {active === 0 && < Button buttonType={ButtonType.PRIMARY} buttonClassName="mr-[30px]"
            handleClick={() => handleUpdateAccount(true)}
          >
            <span className="flex ">
              <span>継続</span>
            </span>
          </Button>}
          <Button
            buttonType={ButtonType.DEFAULT}
            buttonClassName="rounded-[5px]"
            handleClick={() => router.back()}
          >
            戻る
          </Button>
        </div>
      )
      }
    </div >
  );
};
export default CompanyInfoPage;
