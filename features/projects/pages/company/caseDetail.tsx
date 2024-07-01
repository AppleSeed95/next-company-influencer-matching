"use client";

import Checkbox from "@/components/atoms/checkbox";
import SearchBar from "@/components/organisms/searchbar";
import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";
import ApplicationPage from "../admin/applicationPage";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import InfluencerPage from "../admin/influencerPage";
import Modal from "../../utils/modal";
import { useRecoilValue } from "recoil";
import { authUserState } from "@/recoil/atom/auth/authUserAtom";
import { useRouter } from "next/navigation";
import ReactPaginate from "react-paginate";
import Link from "next/link";


export interface caseData {
  caseProps: {
    collectionStatus?: string;
  };
}

export default function CaseDetailPage({ caseProps }: caseData) {
  const user = useRecoilValue(authUserState);
  const router = useRouter();
  const [active, setActive] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCompleteConfirmModal, setShowCompleteConfirmModal] = useState(false);
  const [completeCandidate, setCompleteCandidate] = useState(0)
  const [showCollectionEndModal, setShowCollectionEndModal] = useState(false);
  const [showInfluencer, setShowInfluencer] = useState(false);
  const [caseData, setCaseData] = useState(null);
  const [collectionStatusTemp, setCollectionStatusTemp] = useState("");
  const [startable, setStartable] = useState(false);
  const [influencerData, setInfluencerData] = useState(null);
  const [influencerId, setInfluencerId] = useState(null);
  const [currentApply, setCurrentApply] = useState(null);
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");
  const [visibleData, setVisibleData] = useState([]);
  const [optionedData, setOptionedData] = useState([]);
  const [options, setOptions] = useState([]);

  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = optionedData.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(optionedData.length / itemsPerPage);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % optionedData.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };
  useEffect(() => {
    setCaseData(caseProps);
    document.title = '募集案件詳細';

    setCollectionStatusTemp(caseProps?.collectionStatus);
  }, [caseProps])
  useEffect(() => {

    const fetchData = async () => {
      try {
        const result = await axios.get(`/api/apply/company?id=${id}`);
        if (result.data?.length) {
          setData(result.data);
          setVisibleData(result.data);
          setOptionedData(result.data);
          setInfluencerData(result.data[0].influencerId);
        }
      } catch (e) {
        router.push('/logout')
      }

    };
    fetchData();
    // if (caseData?.collectionStart) {
    //   const startTime = new Date(caseData?.collectionStart);
    //   const today = new Date();
    //   if (
    //     startTime < today &&
    //     caseData?.status === "承認" &&
    //     caseData?.collectionStatus === "募集前"
    //   ) {
    //     handleCollectionStateChange("募集中");
    //   } else {
    //     setStartable(true);
    //   }
    // }
  }, [caseProps, reload]);
  useEffect(() => {
    const fetchInifluencerData = async () => {
      const result = await axios.get(
        `/api/influencer/aInfluencer?id=${influencerId}`
      );

      if (result) setInfluencerData(result.data);
    };
    if (influencerId) fetchInifluencerData();
  }, [influencerId, reload]);
  const { id } = useParams();
  const makeOptioinedData = (visibleData, result) => {
    let resultData = [];
    if (result.length === 0) {
      resultData = visibleData;
    }
    if (result.some((aOption) => aOption === "申請中")) {
      resultData = [
        ...resultData,
        ...visibleData.filter((aData) => aData.status === "申請中"),
      ];
    }
    if (result.some((aOption) => aOption === "否決")) {
      resultData = [
        ...resultData,
        ...visibleData.filter((aData) => aData.status === "否決"),
      ];
    }
    if (result.some((aOption) => aOption === "承認")) {
      resultData = [
        ...resultData,
        ...visibleData.filter((aData) => aData.status === "承認"),
      ];
    }
    if (result.some((aOption) => aOption === "完了報告")) {
      resultData = [
        ...resultData,
        ...visibleData.filter((aData) => aData.status === "完了報告"),
      ];
    }
    if (result.some((aOption) => aOption === "完了")) {
      resultData = [
        ...resultData,
        ...visibleData.filter((aData) => aData.status === "完了"),
      ];
    }
    setOptionedData(resultData.sort((a, b) => -(a.id - b.id)));
  };
  const handleOptionChange = (val) => {
    const isAlready = options.some((a) => a === val);
    const result = isAlready
      ? options.filter((aOptioin) => aOptioin !== val)
      : [...options, val];
    setOptions(result);
    makeOptioinedData(visibleData, result);
  };
  const handleSearch = (data) => {
    setVisibleData(data);
    makeOptioinedData(data, options);
  };
  const onItemClick = ({ idx }: { idx: Number }) => {
    if (active === idx) {
      setActive(null);
    } else {
      setActive(idx);
    }
  };
  const handleApprove = async (val: string, cur: number) => {
    // 承認 否決
    const id = cur ? cur : currentApply.id;
    const result = await axios.put(`/api/apply`, {
      status: val,
      id,
    });
    if (result.data.type === "success") {

      if (val === "否決")
        await axios.post("/api/sendEmail", {
          to: influencerData?.emailAddress,
          subject: "【インフルエンサーめぐり】応募案件の返答がありました",
          html: `<div>${(influencerData?.influencerName?.length > 0 && influencerData?.influencerName !== 'null') ? influencerData?.influencerName : influencerData.nickName} 様<br/>
          <br/>いつもインフルエンサーめぐりをご利用いただきありがとうございます。<br/>
          <br/>「 ${caseData?.caseName} 」に応募いただきありがとうございます。
          <br/>応募内容をもとに慎重に検討しました結果、
          <br/>今回は登録を見送らせていただくこととなりました。
          <br/>ご期待に沿えない結果となってしまい、申し訳ございません。
          <br/>またの機会がございましたら、よろしくお願いいたします。<br/>
          <br/>-----------------------------------------------------
          <br/>不明点がございましたらお問い合わせフォームよりご連絡ください。
          </div> https://influencer-meguri.jp/ask
          `,
        });
      if (val === "承認")
        await axios.post("/api/sendEmail", {
          to: influencerData?.emailAddress,
          subject: "【インフルエンサーめぐり】応募案件が承認されました",
          html: `<div>${(influencerData?.influencerName?.length > 0 && influencerData?.influencerName !== 'null') ? influencerData?.influencerName : influencerData.nickName} 様<br/>
          <br/>いつもインフルエンサーめぐりをご利用いただきありがとうございます。<br/>
          <br/>「 ${caseData?.caseName} 」に応募いただきありがとうございます。
          <br/>承認されましたのでログインしてご確認をお願いします。<br/>
          <br/>-----------------------------------------------------
          <br/>不明点がございましたらお問い合わせフォームよりご連絡ください。
          </div> https://influencer-meguri.jp/ask
          `,
        });
      setShowInfluencer(false);
      setConfirmMsg("操作が成功しました。");
      setShowConfirm(true);
    } else {
      setConfirmMsg("操作が失敗しました。");
      setShowConfirm(true);
    }
    setReload(!reload);
  };
  const handleCollectionStateChange = async (
    state: string,
    resume?: boolean
  ) => {
    if (state === "募集中") {
      if (!(caseData.status === "承認" || caseData.status === '承認 / 否認')) {

        setConfirmMsg("承認されていないため、募集を開始できません。");
        setShowConfirm(true);
        return;
      }
    }
    const update = state;
    const body = resume
      ? {
        update,
        approveMode: false,
        resumeMode: true,
        companyId: caseData.companyId,
      }
      : {
        update,
        approveMode: false,
        companyId: caseData.companyId,
      };
    const result = await axios.put(`/api/case/aCase/?id=${id}`, body);
    if (result.data.type === "success") {
      if (result.data?.updated) {
        setCollectionStatusTemp(result.data.updated);
      }
      else {
        setCollectionStatusTemp(state);
      }
    } else {
      setConfirmMsg(result.data.msg);
      setShowConfirm(true);
    }
  };
  const handleToChat = (id) => {
    const createChatRoom = async () => {
      await axios.post(`/api/chatting/room?id=${id}`);
      if (typeof window !== "undefined") {
        router.push(`/chatting/${id}`);
      }
    };
    createChatRoom();
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
    <div className="h-full">
      <div
        className={
          showModal
            ? "bg-black bg-opacity-25 w-full h-full fixed left-0 overflow-auto duration-500 z-10"
            : "bg-black bg-opacity-25 w-full h-full fixed left-0 overflow-auto opacity-0 pointer-events-none duration-500"
        }
      >
        <div>
          <ApplicationPage
            modalMode
            companyMode
            onCancel={() => setShowModal(false)}
          />
        </div>
      </div>
      <div
        className={
          showCompleteConfirmModal
            ? "bg-black bg-opacity-25 w-full h-full fixed left-0 overflow-auto duration-500 z-10"
            : "bg-black bg-opacity-25 w-full h-full fixed left-0 overflow-auto opacity-0 pointer-events-none duration-500"
        }
      >
        <div className="text-center bg-[white]  px-[35px] sp:px-[12px] sp:text-small w-[25%] sp:w-[90%] m-auto relative shadow-lg ">
          <button
            className="absolute bg-[#5E5E5E] text-[white] px-[15px] py-[10px] top-0 right-0 cursor-pointer"
            onClick={(e) => {
              setShowCompleteConfirmModal(false);
            }}
          >
            x
          </button>
          <div className="pt-[30px] mt-[350px] sp:mt-[150px]">
            <div>完了報告されてませんが、完了しますか？</div>
            <div className="flex justify-center gap-[10px]">
              <Button
                buttonType={ButtonType.PRIMARY}
                handleClick={() => {
                  handleApprove("完了", completeCandidate);
                  setShowCompleteConfirmModal(false);
                }}
                buttonClassName="my-[20px]"
              >
                はい
              </Button>
              <Button
                buttonType={ButtonType.DEFAULT}
                handleClick={() => {
                  setShowCompleteConfirmModal(false);
                }}
                buttonClassName="my-[20px] rounded-[5px]"
              >
                いいえ
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          showCollectionEndModal
            ? "bg-black bg-opacity-25 w-full h-full fixed left-0 overflow-auto duration-500 z-10"
            : "bg-black bg-opacity-25 w-full h-full fixed left-0 overflow-auto opacity-0 pointer-events-none duration-500"
        }
      >
        <div className="text-center bg-[white]  px-[35px] sp:px-[12px] sp:text-small w-[25%] sp:w-[90%] m-auto relative shadow-lg ">
          <button
            className="absolute bg-[#5E5E5E] text-[white] px-[15px] py-[10px] top-0 right-0 cursor-pointer"
            onClick={(e) => {
              setShowCollectionEndModal(false);
            }}
          >
            x
          </button>
          <div className="pt-[30px] mt-[350px] sp:mt-[150px]">
            <div>本案件の募集を終了しますか?</div>
            <div className="flex justify-center gap-[10px]">
              <Button
                buttonType={ButtonType.PRIMARY}
                handleClick={() => {
                  handleCollectionStateChange("募集終了");
                  setShowCollectionEndModal(false);
                }}
                buttonClassName="my-[20px]"
              >
                はい
              </Button>
              <Button
                buttonType={ButtonType.DEFAULT}
                handleClick={() => {
                  setShowCollectionEndModal(false);
                }}
                buttonClassName="my-[20px] rounded-[5px]"
              >
                いいえ
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          showInfluencer
            ? "bg-black bg-opacity-25 w-full h-full fixed left-0 overflow-auto duration-500 z-10"
            : "bg-black bg-opacity-25 w-full h-full fixed left-0 overflow-auto opacity-0 pointer-events-none duration-500"
        }
      >
        <div className="flex items-center h-full">
          <InfluencerPage
            handleApprove={handleApprove}
            modalMode
            showButton={currentApply?.status === "申請中"}
            influencerData={influencerData}
            onCancel={() => setShowInfluencer(false)}
          />
        </div>
      </div>
      <div
        className={
          showConfirm
            ? "bg-black bg-opacity-25 w-full h-full fixed left-0 overflow-auto duration-500 z-10"
            : "bg-black bg-opacity-25 w-full h-full fixed left-0 overflow-auto opacity-0 pointer-events-none duration-500"
        }
      >
        <Modal
          body={confirmMsg}
          onOk={() => setShowConfirm(false)}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
      <div className="flex flex-col h-full px-[30px] sp:px-[12px] pt-[110px] pb-[30px]">
        <div className="flex items-center justify-between">
          <div className="text-title sp:hidden">募集案件詳細</div>
          <Link href={"/appliedList"}>
            <Button
              buttonType={ButtonType.PRIMARY}
              buttonClassName="mt-[15px] sp:my-[15px] sp:text-small rounded-[0px]"
            >
              <div className="flex">
                戻る
              </div>
            </Button>
          </Link>
        </div>

        <SearchBar
          data={data}
          setVisibleData={handleSearch}
          keys={["nickName", "date"]}
          title={
            <div className="flex flex-wrap items-center gap-x-[20px] gap-y-[10px]">
              <span
                className="text-[#3F8DEB] underline hover:cursor-pointer underline-offset-3"
                onClick={() => setShowModal(true)}
              >
                案件詳細
              </span>
              <span className="w-[100px]">{`状態: ${collectionStatusTemp ? collectionStatusTemp : ""
                }`}</span>
              <span className="flex flex-wrap">
                <span>募集期間：</span>
                <div className="flex flex-wrap">
                  <span>{`${dateString(caseData?.collectionStart)} ～`}</span>
                  <span>
                    {dateString(caseData?.collectionEnd)}
                  </span>
                </div>
              </span>

              {collectionStatusTemp === "募集前" && (
                <Button
                  buttonType={ButtonType.PRIMARY}
                  buttonClassName="rounded-[0px] px-[15px] py-[7px]"
                  handleClick={() => {
                    handleCollectionStateChange("募集中");
                  }}
                >
                  募集開始
                </Button>
              )}
              {(collectionStatusTemp === "募集中" ||
                collectionStatusTemp === "停止中") && (
                  <Button
                    buttonType={ButtonType.DANGER}
                    buttonClassName="rounded-[0px] px-[15px] py-[7px]"
                    handleClick={() => {
                      setShowCollectionEndModal(true);
                    }}
                  >
                    募集終了
                  </Button>
                )}
              {collectionStatusTemp === "募集中" && (
                <Button
                  buttonType={ButtonType.DEFAULT}
                  buttonClassName="rounded-[0px]"
                  handleClick={() => {
                    handleCollectionStateChange("停止中");
                  }}
                >
                  停止
                </Button>
              )}
              {collectionStatusTemp === "停止中" && (
                <Button
                  buttonType={ButtonType.DEFAULT}
                  buttonClassName="rounded-[0px]"
                  handleClick={() => {

                    if (caseData.edited) {
                      handleCollectionStateChange("募集中");
                    } else {
                      handleCollectionStateChange("募集中", true);
                    }
                  }}
                >
                  再開
                </Button>
              )}
            </div>
          }
          extendChild={
            <div>
              <div className="mt-[30px] sp:mt-[10px] text-small text-[#3F8DEB] font-bold">
                条件を絞り込みできます。
              </div>
              <div className="flex sp:block mt-[8px] flex-wrap gap-x-10 ">
                <div className="flex flex-wrap">
                  <span className="mr-[11px] sp:text-sp text-[#A8A8A8]">状態 ：  </span>
                  <div className="flex flex-wrap">
                    <Checkbox
                      title={"申請中"}
                      handleChange={(v) => handleOptionChange("申請中")}
                      checkBoxClassName="mr-[20px]"
                    />
                    <Checkbox
                      title={"承認"}
                      checkBoxClassName="mr-[20px]"
                      handleChange={(v) => handleOptionChange("承認")}
                    />
                    <Checkbox
                      title={"否認"}
                      checkBoxClassName="mr-[20px]"
                      handleChange={(v) => handleOptionChange("否決")}
                    />
                    <Checkbox
                      title={"完了報告"}
                      checkBoxClassName="mr-[20px]"
                      handleChange={(v) => handleOptionChange("完了報告")}
                    />
                    <Checkbox
                      title={"完了"}
                      handleChange={(v) => handleOptionChange("完了")}
                    />
                  </div>
                </div>
              </div>
            </div>
          }
        />
        <div className="text-[14px] text-[#A9A9A9] mb-[10px] sp:text-spsmall">
          {`該当数：${optionedData.length}件`}
        </div>
        <div className="sp:hidden grow">
          {currentItems.length !== 0 ? (
            <table className="w-full text-[14px] sp:hidden">
              <thead>
                <tr>
                  <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] w-[25%]">
                    ニックネーム
                  </td>
                  <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] ">
                    SNSの種類
                  </td>
                  <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                    状態
                  </td>
                  <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                    申請日
                  </td>
                  <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                    チャット
                  </td>
                  <td className="py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] w-[100px]"></td>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((aData, idx) => (
                  <tr key={idx}>
                    <td className="px-[35px] py-[25px]  border border-[#D3D3D3] hover:cursor-pointer">
                      <span
                        onClick={() => {
                          setCurrentApply(aData);
                          setInfluencerId(aData.influencerId);
                          setShowInfluencer(true);
                        }}
                        className="text-[#3F8DEB] underline underline-[#3F8DEB] underline-offset-[3px]"
                      >
                        {aData.nickName}
                      </span>
                    </td>
                    <td className="px-[35px] py-[25px]  border border-[#D3D3D3] ">
                      <div className="flex flex-wrap items-center gap-[15px]">
                        {JSON.parse(aData.instagram).account !== "" && (
                          <img
                            className="w-[35px]"
                            src="/img/sns/Instagram.svg"
                            alt="instagram"
                          />
                        )}
                        {JSON.parse(aData.tiktok).account !== "" && (
                          <img
                            className="w-[35px]"
                            src="/img/sns/tiktok.svg"
                            alt="tiktok"
                          />
                        )}
                        {JSON.parse(aData.x).account !== "" && (
                          <img
                            className="w-[35px]"
                            src="/img/sns/x.svg"
                            alt="x"
                          />
                        )}
                        {JSON.parse(aData.youtube).account !== "" && (
                          <img
                            className="w-[35px]"
                            src="/img/sns/youtube.svg"
                            alt="youtube"
                          />
                        )}
                        {JSON.parse(aData.facebook).account !== "" && (
                          <img
                            className="w-[35px]"
                            src="/img/sns/facebook.svg"
                            alt="facebook"
                          />
                        )}
                        {aData.otherSNS && aData.otherSNS !== 'null' && (
                          <span className="text-[#C0C0C0]">etc.</span>
                        )}
                      </div>
                    </td>
                    <td className="px-[35px] py-[25px]  border border-[#D3D3D3] hover:cursor-pointer">
                      {aData.status === '否決' ? '否認' : aData.status}
                    </td>
                    <td className="px-[35px] py-[25px]  border border-[#D3D3D3]">
                      {aData.date}
                    </td>
                    <td className="w-[150px] py-[25px]  border border-[#D3D3D3]">
                      <img
                        className="w-[35px] m-auto cursor-pointer"
                        src="/img/chatting.svg"
                        alt="chatting"
                        onClick={() => handleToChat(aData.id)}
                      />
                    </td>
                    <td className="w-[100px] py-[25px]  border text-center border-[#D3D3D3] ">
                      {aData.status === "完了" &&
                        <div className="text-white bg-[#236997] p-[10px] m-[5px] rounded-lg shadow-sm">
                          完了
                        </div>}
                      {(aData.status === '承認' || aData.status === '完了報告') && <Button
                        handleClick={() => {
                          if (aData.status === '完了報告') {
                            handleApprove("完了", aData.id)
                          } else {
                            setCompleteCandidate(aData.id);
                            setShowCompleteConfirmModal(true);
                          }
                        }}
                        buttonType={ButtonType.PRIMARY}
                      >
                        完了
                      </Button>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center pt-[200px] text-title text-[#757575]">
              該当するインフルエンサーがいません
            </div>
          )}
        </div>
        <div className="sp:hidden">
          <ReactPaginate
            containerClassName="pagination-conatiner"
            pageClassName="pagination-page"
            activeClassName="pagination-active"
            disabledClassName="pagination-disable"
            previousClassName="pagination-page"
            nextClassName="pagination-page"
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
          />
        </div>
        <div className="lg:hidden grow">
          {currentItems?.map((aData, idx) => (
            <div key={idx} className=" bg-[#F8F9FA] border border-[#D3D3D3]">
              <div className="flex justify-between px-[30px] py-[20px] w-full">
                <div className="flex">
                  <span
                    onClick={() => {
                      setCurrentApply(aData);
                      setInfluencerId(aData.influencerId);
                      setShowInfluencer(true);
                    }}
                    className="text-[#3F8DEB] underline hover:cursor-pointer underline-offset-3 sp:text-sp"
                  >
                    {aData.nickName}
                  </span>
                </div>

                <img
                  onClick={() => onItemClick({ idx })}
                  src={idx === active ? "/img/up.svg" : "/img/down.svg "}
                  className="inline h-[8px]"
                />
              </div>
              {idx === active && (
                <div className="p-[25px]">
                  <div className="flex">
                    <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                      SNSの種類
                    </div>
                    <span className="mb-[7px] sp:text-spsmall">
                      <div className="flex flex-wrap items-center gap-[15px]">
                        {JSON.parse(aData.instagram).account !== "" && (
                          <img
                            className="w-[35px]"
                            src="/img/sns/Instagram.svg"
                            alt="instagram"
                          />
                        )}
                        {JSON.parse(aData.tiktok).account !== "" && (
                          <img
                            className="w-[35px]"
                            src="/img/sns/tiktok.svg"
                            alt="tiktok"
                          />
                        )}
                        {JSON.parse(aData.x).account !== "" && (
                          <img
                            className="w-[35px]"
                            src="/img/sns/x.svg"
                            alt="x"
                          />
                        )}
                        {JSON.parse(aData.youtube).account !== "" && (
                          <img
                            className="w-[35px]"
                            src="/img/sns/youtube.svg"
                            alt="youtube"
                          />
                        )}
                        {JSON.parse(aData.facebook).account !== "" && (
                          <img
                            className="w-[35px]"
                            src="/img/sns/facebook.svg"
                            alt="facebook"
                          />
                        )}
                        {aData.otherSNS && aData.otherSNS !== "null" && (
                          <span className="text-[#C0C0C0]">etc.</span>
                        )}
                      </div>
                    </span>
                  </div>
                  <div className="flex">
                    <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                      状態
                    </div>
                    <span className="mb-[7px] sp:text-spsmall">
                      {aData.status === '否決' ? '否認' : aData.status}
                    </span>
                  </div>
                  <div className="flex">
                    <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                      申請日
                    </div>
                    <span className="mb-[7px] sp:text-spsmall">
                      {aData.date}
                    </span>
                  </div>
                  <div className="flex">
                    <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                      チャット
                    </div>
                    <span className="mb-[7px] sp:text-spsmall">
                      <img
                        className="w-[35px] m-auto cursor-pointer"
                        src="/img/chatting.svg"
                        alt="chatting"
                        onClick={() => handleToChat(aData.id)}
                      />
                    </span>
                  </div>
                  <div className="flex">
                    <span className="mb-[7px] sp:text-spsmall">
                      {aData.status === "完了" &&
                        <div className="text-white bg-[#236997] p-[10px] m-[5px] rounded-lg shadow-sm">
                          完了
                        </div>}
                      {(aData.status === '承認' || aData.status === '完了報告') && <Button
                        handleClick={() => {
                          if (aData.status === '完了報告') {
                            handleApprove("完了", aData.id)
                          } else {
                            setCompleteCandidate(aData.id);
                            setShowCompleteConfirmModal(true);
                          }
                        }}
                        buttonType={ButtonType.PRIMARY}
                      >
                        完了
                      </Button>
                      }
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="lg:hidden">
          <ReactPaginate
            containerClassName="pagination-conatiner"
            pageClassName="pagination-page"
            activeClassName="pagination-active"
            disabledClassName="pagination-disable"
            previousClassName="pagination-page"
            nextClassName="pagination-page"
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
          />
        </div>
      </div>
    </div>
  );
}
