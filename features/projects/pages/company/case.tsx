"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";
import RadioBtn from "@/components/atoms/radio";
import Checkbox from "@/components/atoms/checkbox";
import Input from "@/components/atoms/input";
import TextArea from "@/components/atoms/textarea";
import axios from "axios";
import { getUser } from "../../utils/getUser";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Modal from "../../utils/modal";

const CasePage: React.FC = () => {
  const [data, setData] = useState({
    caseType: "来 店",
    caseName: "",
    caseContent: "",
    wantedHashTag: "",
    wantedSNS: "",
    casePlace: "",
    caseEnd: "",
    collectionEnd: "",
    collectionStatus: "",
    collectionStart: "",
    collectionCnt: "",
    addition: "",
    id: null,
    status: "",
    reason: "",
  });

  const router = useRouter();
  const user = getUser();

  const [wantedSNS, setWantedSNS] = useState([]);
  const [error, setError] = useState("");
  const { id } = useParams();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("操作が成功しました。");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`/api/case/aCase?id=${id}`);
      if (result.data) setData(result.data.data);
      setWantedSNS(JSON.parse(result.data?.data.wantedSNS));
    };
    if (id) fetchData();
    document.title = '募集案件登録・編集';
  }, []);
  const handleSNSChange = (val: string) => {
    let isAlreadyExits = false;
    wantedSNS.forEach((aSNS) => {
      if (aSNS === val) isAlreadyExits = true;
    });
    if (!isAlreadyExits) {
      setWantedSNS([...wantedSNS, val]);
    } else {
      let filteredArray = wantedSNS.filter((element) => element !== val);
      setWantedSNS(filteredArray);
    }
  };
  const handleRequest = async (saveMode: boolean) => {
    if (isLoading) return;
    const { targetStatus } = user.user;

    if (targetStatus !== "稼動中") {
      setConfirmMsg("稼働中ではないので申請できません。");
      setShowConfirm(true);
      return;
    }

    const body = {
      ...data,
      wantedSNS: JSON.stringify(wantedSNS),
      companyId: user.user?.targetId,
    };
    const msgs = {
      caseType: "案件種別を選択してください",
      caseName: "案件概要を入力してください",
      caseContent: "案件内容を入力してください",
      collectionEnd: "募集終了を入力してください ",
      caseEnd: "案件終了を入力してください",
    };
    const keys = Object.keys(msgs);
    let isValid = true;
    keys.forEach((aKey) => {
      if (!body[aKey] || body[aKey] === "") {
        if (!isValid) return;
        setError(msgs[aKey]);
        isValid = false;
      }
    });
    const casePlace = "訪問場所を入力してください";
    if (body.caseType === "来 店" && body.casePlace === "") {
      setError(casePlace);
      return;
    }
    const collectionEndDate = new Date(body.collectionEnd);
    const caseEndDate = new Date(body.caseEnd);
    if (!(caseEndDate > collectionEndDate)) {
      setError("イベント終了時間と募集終了時間を正しく選択します。");
      return;
    }
    if (isValid) {
      if (saveMode) {
        if (data.id) {
          const result = await axios.put("/api/case", {
            ...body,
            status: "申請前",
          });
          setError("");
          setShowConfirm(true);
        } else {
          const result = await axios.post("/api/case", {
            ...body,
            status: "申請前",
          });
          setError("");
          setIsLoading(false);
          router.replace("/appliedList");
        }
      } else {
        if (data.id) {
          const result = await axios.put("/api/case", {
            ...body,
            status: "申請中",
          });
          setError("");
          setIsLoading(false);
          router.back();
        } else {
          if (isLoading) return;
          setIsLoading(true);
          const result = await axios.post("/api/case", {
            ...body,
            status: "申請中",
          });
          await axios.post("/api/sendEmail", {
            to: user.user?.email,
            subject: "【インフルエンサーめぐり】募集案件の登録申請をしました",
            content: `${user.user?.name} 様
          \nいつもインフルエンサーめぐりをご利用いただきありがとうございます。
          \n
          \n募集案件の登録申請を受け付けました。
          \n申請確認を確認しますのでしばらくお待ちください。
          \n-----------------------------------------------------
          \n 不明点がございましたらお問い合わせフォームよりご連絡ください。
          \n http://localhost:3000/ask。
          `,
          });
          await axios.post("/api/sendEmail", {
            from: user.user?.email,
            subject: "【インフルエンサーめぐり】募集案件の登録申請がありました",
            content: `募集案件の登録申請がありました。
          \nログインして確認してください。
          \n
          `,
          });
          setError("");
          router.replace("/appliedList");
        }
      }
    }
    setIsLoading(false);
  };
  const determineEditable = () => {
    let startable;

    if (!data.collectionStatus) {
      startable =
        !data.status || data.status === "申請前" || data.status === "否認";
    } else {
      startable =
        (data.status === "承認" && data.collectionStatus === "停止中") ||
        (data.status === "否認" && data.collectionStatus === "募集中") ||
        data.status === "申請前" ||
        (data.status === "否認" && data.collectionStatus === "停止");
    }
    return startable;
  };
  return (
    <div className="text-center bg-[white] px-[35px] sp:px-[12px] sp:text-small ">
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
      <div className="flex  pt-[20px] pb-[8px]  w-[full] border-b-[1px] border-[#DDDDDD] mt-[70px] sp:mt-[96px]">
        <span className="text-title sp:text-sptitle">募集案件登録・編集</span>
      </div>
      <div className="flex  pt-[20px] pb-[8px] w-[60%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD] mt-[90px] sp:mt-[30px]   sp:px-[18px]">
        <span className="w-[30%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">案件種別</span>
          <span className="ml-[10px] text-[#EE5736] text-[11px]">必須</span>
        </span>
        <div className="flex">
          <RadioBtn
            title="来店"
            defaultValue={data.caseType}
            handleChange={(val) => setData({ ...data, caseType: val })}
            options={["来 店", "通販"]}
          />
        </div>
      </div>
      <div className="flex  pt-[20px] pb-[8px] w-[60%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[30%] mt-[5px] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>案件名</span>
          <span className="ml-[10px] text-[#EE5736] text-[11px]">必須</span>
        </span>
        <Input
          value={data.caseName}
          inputClassName="max-w-[250px] grow border-[#D3D3D3] w-[100%]"
          placeholder="案件名を入力してください"
          requirMsg="案件概要を入力してください"
          handleChange={(val) => setData({ ...data, caseName: val })}
        />
      </div>
      <div className="flex pt-[20px] pb-[30px] w-[60%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[30%] mt-[5px] sp:w-[100px] mt-[5px] flex justify-end sp:justify-start  mr-[67px]">
          <span>案件内容</span>
          <span className="ml-[10px] text-[#EE5736] text-[11px]">必須</span>
        </span>
        <TextArea
          value={data.caseContent}
          handleChange={(val) => setData({ ...data, caseContent: val })}
          textAreaClassName="max-w-[300px] h-[95px] grow "
          placeholder="カフェPR"
          requirMsg="案件内容を入力してください"
        />
      </div>
      <div className="flex  pt-[20px] pb-[8px] w-[60%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[30%] mt-[5px] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>希望のハッシュタグ</span>
          <span className="ml-[10px] text-[#EE5736] text-[11px] invisible">
            必須
          </span>
        </span>
        <Input
          notRequired
          value={data.wantedHashTag}
          handleChange={(val) => setData({ ...data, wantedHashTag: val })}
          inputClassName="max-w-[250px] grow border-[#D3D3D3] w-[100%]"
        />
      </div>
      <div className="flex  py-[20px] w-[60%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[30%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>希望のSNS</span>
          <span className="ml-[10px] text-[#EE5736] text-[11px] invisible">
            必須
          </span>
        </span>
        <div className="flex flex-wrap">
          <Checkbox
            value={wantedSNS.includes("instagram")}
            handleChange={(val) => handleSNSChange("instagram")}
            title={
              <img
                className="w-[35px]"
                src="/img/sns/Instagram.svg"
                alt="instagram"
              />
            }
            checkBoxClassName="mr-[20px]"
          />
          <Checkbox
            value={wantedSNS.includes("tiktok")}
            handleChange={(val) => handleSNSChange("tiktok")}
            title={
              <img
                className="w-[35px]"
                src="/img/sns/tiktok.svg"
                alt="tiktok"
              />
            }
            checkBoxClassName="mr-[20px]"
          />
          <Checkbox
            handleChange={(val) => handleSNSChange("x")}
            value={wantedSNS.includes("x")}
            title={<img className="w-[35px]" src="/img/sns/x.svg" alt="x" />}
            checkBoxClassName="mr-[20px]"
          />
          <Checkbox
            value={wantedSNS.includes("youtube")}
            handleChange={(val) => handleSNSChange("youtube")}
            title={
              <img
                className="w-[35px]"
                src="/img/sns/youtube.svg"
                alt="youtube"
              />
            }
            checkBoxClassName="mr-[20px]"
          />
          <Checkbox
            value={wantedSNS.includes("facebook")}
            handleChange={(val) => handleSNSChange("facebook")}
            title={
              <img
                className="w-[35px]"
                src="/img/sns/facebook.svg"
                alt="youtube"
              />
            }
            checkBoxClassName="mr-[20px]"
          />
          <Checkbox
            value={wantedSNS.includes("etc.")}
            handleChange={(val) => handleSNSChange("etc.")}
            title={"etc."}
            checkBoxClassName="mr-[20px]"
          />
        </div>
      </div>
      <div className="flex  pt-[20px] pb-[8px] w-[60%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[30%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>来店場所</span>
          <span className="ml-[10px] text-[#EE5736] text-[11px] invisible">
            必須
          </span>
        </span>
        <Input
          value={data.casePlace}
          notRequired
          handleChange={(val) => setData({ ...data, casePlace: val })}
          inputClassName="max-w-[250px] grow border-[#D3D3D3] w-[100%]"
        />
      </div>
      <div className="flex  pt-[20px] pb-[8px] w-[60%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[30%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>募集開始</span>
          <span className="ml-[10px] text-[#EE5736] text-[11px] invisible">
            必須
          </span>
        </span>
        <Input
          value={data.collectionStart}
          notRequired
          dateTime
          handleChange={(val) => setData({ ...data, collectionStart: val })}
          inputClassName="max-w-[250px] grow border-[#D3D3D3] w-[100%]"
          placeholder="yyyy/mm/dd hh:mm"
        />
      </div>
      <div className="flex  pt-[20px] pb-[8px] w-[60%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[30%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>募集終了</span>
          <span className="ml-[10px] text-[#EE5736] text-[11px]">必須</span>
        </span>
        <Input
          value={data.collectionEnd}
          dateTime
          handleChange={(val) => setData({ ...data, collectionEnd: val })}
          inputClassName="max-w-[250px] grow border-[#D3D3D3] w-[100%]"
          placeholder="yyyy/mm/dd hh:mm"
        />
      </div>
      <div className="flex  pt-[20px] pb-[8px] w-[60%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[30%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>案件終了</span>
          <span className="ml-[10px] text-[#EE5736] text-[11px]">必須</span>
        </span>
        <Input
          value={data.caseEnd}
          dateTime
          handleChange={(val) => setData({ ...data, caseEnd: val })}
          inputClassName="max-w-[250px] grow border-[#D3D3D3] w-[100%]"
          placeholder="yyyy/mm/dd hh:mm"
        />
      </div>
      <div className="flex  pt-[20px] pb-[8px] w-[60%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[30%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span>募集人数</span>
          <span className="ml-[10px] text-[#EE5736] text-[11px] invisible">
            必須
          </span>
        </span>
        <Input
          value={data.collectionCnt}
          notRequired
          handleChange={(val) => setData({ ...data, collectionCnt: val })}
          inputClassName="max-w-[250px] grow border-[#D3D3D3] w-[100%]"
        />
      </div>
      <div className="flex pt-[20px] pb-[8px] w-[60%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[30%] mt-[5px] sp:w-[100px] mt-[5px] flex justify-end sp:justify-start  mr-[67px]">
          <span>補足・注意事項</span>
          <span className="ml-[10px] text-[#EE5736] text-[11px] invisible">
            必須
          </span>
        </span>
        <TextArea
          value={data.addition}
          handleChange={(val) => setData({ ...data, addition: val })}
          textAreaClassName="max-w-[300px] h-[95px] grow border-[#D3D3D3] "
          placeholder="注意事項を入力してください"
        />
      </div>
      {data.id && [
        <div
          key={"1"}
          className="flex items-center  pt-[20px] pb-[8px] w-[60%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]"
        >
          <span className="w-[30%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
            <span>申請状態</span>
            <span className="ml-[10px] text-[#EE5736] text-[11px] invisible">
              必須
            </span>
          </span>
          <div>{data.status}</div>
        </div>,
        <div
          key={"1"}
          className="flex items-center pt-[20px] pb-[8px] w-[60%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]"
        >
          <span className="w-[30%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
            <span>募集状況</span>
            <span className="ml-[10px] text-[#EE5736] text-[11px] invisible">
              必須
            </span>
          </span>
          <div>{data.collectionStatus}</div>
        </div>,
        data.status === "否認" ? (
          <div
            key={"2"}
            className="flex  pt-[20px] pb-[8px] w-[60%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]"
          >
            <span className="w-[30%] mt-[5px] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
              <span>否認理由</span>
              <span className="ml-[10px] text-[#EE5736] text-[11px] invisible">
                必須
              </span>
            </span>
            <div>{data.reason}</div>
          </div>
        ) : (
          ""
        ),
      ]}
      {error !== "" && (
        <div className="text-center m-[10px] text-[#EE5736]">{error}</div>
      )}
      <div className="flex justify-center mt-[36px] mb-[160px] sp:mb-[60px]">
        {determineEditable() && [
          <Button
            key={"1"}
            buttonType={ButtonType.PRIMARY}
            buttonClassName="mr-[30px]"
            handleClick={() => handleRequest(false)}
          >
            <span className="flex ">
              <span>申請</span>
              <img
                className={
                  isLoading ? "rotate w-[14px] ml-[5px]" : "w-[14px] ml-[5px]"
                }
                src={isLoading ? "/img/refresh.svg" : "/img/apply.svg"}
                alt="refresh"
              />
            </span>
          </Button>,
          <Button
            key={"2"}
            buttonType={ButtonType.DANGER}
            buttonClassName="mr-[30px]"
            handleClick={() => handleRequest(true)}
          >
            <span className="flex ">
              <span>保存</span>
              <img
                className="w-[14px] ml-[5px]"
                src="/img/download.svg"
                alt="refresh"
              />
            </span>
          </Button>,
        ]}
        <Link href={"/appliedList"}>
          <Button
            buttonType={ButtonType.PRIMARYDEFAULT}
            buttonClassName="rounded-[5px]"
          >
            戻る
          </Button>
        </Link>
      </div>
    </div>
  );
};
export default CasePage;
