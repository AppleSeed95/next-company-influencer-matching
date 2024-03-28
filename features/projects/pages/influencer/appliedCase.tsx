"use client";

import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";
import Checkbox from "@/components/atoms/checkbox";
import SearchBar from "@/components/organisms/searchbar";
import ApplicationPage from "../admin/applicationPage";
import { useRecoilValue } from "recoil";
import { useState, useEffect } from "react";
import { authUserState } from "@/recoil/atom/auth/authUserAtom";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import ReactPaginate from "react-paginate";
export default function AppledCase() {
  const user = useRecoilValue(authUserState);
  const router = useRouter();
  const [active, setActive] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [caseId, setCaseId] = useState(null);
  const [visibleData, setVisibleData] = useState([]);
  const [optionedData, setOptionedData] = useState([]);
  const [options, setOptions] = useState([]);
  const [options1, setOptions1] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reload, setReload] = useState(false);

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
    const fetchData = async () => {
      setIsLoading(true);
      const result = await axios.get(`/api/apply?id=${user.user.targetId}`);
      if (result.data?.length) {
        setCaseId(result.data[0].caseId);
        setData(result.data);
        setVisibleData(result.data);
        setOptionedData(result.data);
      }
      setIsLoading(false);
    };
    if (user) fetchData();
    document.title = '応募案件一覧';
  }, [reload]);
  const handleEndReport = async (id) => {
    const result = await axios.put(`/api/apply`, {
      status: "完了報告",
      id,
    });
    if (result.data.type === "success") {
      await axios.post("/api/sendEmail", {
        to: result.data.emailAddress,
        subject: "【インフルエンサーめぐり】案件の完了報告が届きました",
        content: `${result.data.representativeName} 様
          \n いつもインフルエンサーめぐりをご利用いただきありがとうございます。
          \n以下の案件で完了報告が届いてます。
          \nログインしてご確認をお願いします。
          \n
          \n案件名  ：${result.data.caseName}
          \nインフルエンサー名：${result.data.influencerName}
          \nURL   ：http://localhost:3000/caseDetail/${result.data.caseID}
          \n-----------------------------------------------------
          \n 不明点がございましたらお問い合わせフォームよりご連絡ください。
          \n http://localhost:3000/ask。
          `,
      });
      setReload(!reload);
    }
  };
  const makeOptioinedData = (visibleData, result, result1) => {
    let resultData = [];
    if (result.length === 0) {
      resultData = visibleData;
    }
    if (result.some((aOption) => aOption === "来店")) {
      resultData = [
        ...resultData,
        ...visibleData.filter((aData) => aData.caseType === "来 店"),
      ];
    }
    if (result.some((aOption) => aOption === "通販")) {
      resultData = [
        ...resultData,
        ...visibleData.filter((aData) => aData.caseType === "通販"),
      ];
    }
    if (result1.length === 0) {
      setOptionedData(resultData);
      return;
    }
    let resultData1 = [];
    if (result1.some((aOption) => aOption === "申請中")) {
      resultData1 = [
        ...resultData1,
        ...resultData.filter((aData) => aData.status === "申請中"),
      ];
    }
    if (result1.some((aOption) => aOption === "否決")) {
      resultData1 = [
        ...resultData1,
        ...resultData.filter((aData) => aData.status === "否決"),
      ];
    }
    if (result1.some((aOption) => aOption === "承認")) {
      resultData1 = [
        ...resultData1,
        ...resultData.filter((aData) => aData.status === "承認"),
      ];
    }
    if (result1.some((aOption) => aOption === "完了")) {
      resultData1 = [
        ...resultData1,
        ...resultData.filter((aData) => aData.status === "完了"),
      ];
    }
    setOptionedData(resultData1.sort((a, b) => -(a.id - b.id)));
  };
  const handleOptionChange = (val) => {
    const isAlready = options.some((a) => a === val);
    const result = isAlready
      ? options.filter((aOptioin) => aOptioin !== val)
      : [...options, val];
    setOptions(result);
    makeOptioinedData(visibleData, result, options1);
  };
  const handleOptionChange1 = (val) => {
    const isAlready = options1.some((a) => a === val);
    const result = isAlready
      ? options1.filter((aOptioin) => aOptioin !== val)
      : [...options1, val];
    setOptions1(result);
    makeOptioinedData(visibleData, options, result);
  };
  const handleSearch = (data) => {
    setVisibleData(data);
    makeOptioinedData(data, options, options1);
  };

  const onItemClick = ({ idx }: { idx: Number }) => {
    if (active === idx) {
      setActive(null);
    } else {
      setActive(idx);
    }
  };
  const handleToChat = (id) => {
    const createChatRoom = async () => {
      await axios.post(`/api/chatting/room?id=${id}`);
      if (typeof window !== "undefined") {
        router.push(`/chattingInf/${id}`);
      }
    };
    createChatRoom();
  };
  return (
    <div className="h-full">
      <div
        className={
          showModal
            ? "bg-black bg-opacity-25 w-full h-full fixed left-0 overflow-auto duration-500"
            : "bg-black bg-opacity-25 w-full h-full fixed left-0 overflow-auto opacity-0 pointer-events-none duration-500"
        }
      >
        {caseId && (
          <div>
            <ApplicationPage
              influencerMode
              modalMode
              caseID={caseId}
              onCancel={() => setShowModal(false)}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col h-full px-[30px] sp:px-[12px] pt-[110px] pb-[30px]">
        <div className="text-title sp:hidden">応募案件一覧</div>
        <SearchBar
          data={data}
          setVisibleData={handleSearch}
          keys={["companyName", "caseName", "casePlace"]}
          extendChild={
            <div>
              <div className="mt-[30px] sp:mt-[10px] text-small text-[#3F8DEB] font-bold">
                条件を絞り込みできます。
              </div>
              <div className="flex sp:block mt-[8px] flex-wrap gap-x-10">
                <div className="flex">
                  <Checkbox
                    prefix="案件種別 ： "
                    title={"来店"}
                    checkBoxClassName="mr-[20px]"
                    handleChange={(v) => handleOptionChange("来店")}
                  />
                  <Checkbox
                    title={"通販"}
                    checkBoxClassName="mr-[20px]"
                    handleChange={(v) => handleOptionChange("通販")}
                  />
                </div>
                <div className="flex">
                  <Checkbox
                    prefix="状態 ： "
                    title={"申請中"}
                    handleChange={(v) => handleOptionChange1("申請中")}
                    checkBoxClassName="mr-[20px]"
                  />
                  <Checkbox
                    title={"承認"}
                    checkBoxClassName="mr-[20px]"
                    handleChange={(v) => handleOptionChange1("承認")}
                  />
                  <Checkbox
                    title={"否決"}
                    checkBoxClassName="mr-[20px]"
                    handleChange={(v) => handleOptionChange1("否決")}
                  />
                  <Checkbox
                    title={"完了"}
                    handleChange={(v) => handleOptionChange1("完了")}
                  />
                </div>
              </div>
            </div>
          }
        />
        <div className="text-[14px] text-[#A9A9A9] mb-[10px] sp:text-spsmall">
          {`該当数：${optionedData.length}件`}
        </div>
        {isLoading ? (
          <Image
            className="m-auto"
            src={"/img/loading.gif"}
            alt="loading"
            width={50}
            height={50}
          />
        ) : (
          <div className="sp:hidden grow">
            {currentItems.length !== 0 ? (
              <table className="w-full text-[14px] sp:hidden">
                <thead>
                  <tr>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                      会社名
                    </td>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]  w-[20%]">
                      案件名
                    </td>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                      案件種別
                    </td>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                      来店場所
                    </td>
                    <td className="text-center w-[100px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                      状態
                    </td>
                    <td className="text-center w-[100px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] ">
                      チャット
                    </td>
                    <td className="text-center w-[120px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] "></td>
                  </tr>
                </thead>
                <tbody>
                  {currentItems?.map((aData, idx) => (
                    <tr key={idx}>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3] hover:cursor-pointer">
                        {aData.companyName}
                      </td>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3] ">
                        <span
                          className="text-[#3F8DEB] underline hover:cursor-pointer underline-offset-3 sp:text-sp"
                          onClick={() => {
                            setCaseId(aData.caseId);
                            setShowModal(true);
                          }}
                        >
                          {aData.caseName}
                        </span>
                      </td>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3] hover:cursor-pointer">
                        {aData.caseType}
                      </td>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3]">
                        {aData.casePlace}
                      </td>
                      <td className="text-center w-[100px] py-[25px]  border border-[#D3D3D3]">
                        {aData.status}
                      </td>
                      <td className="text-center w-[100px] py-[25px]  border border-[#D3D3D3] ">
                        <img
                          className="w-[35px] m-auto cursor-pointer"
                          src="/img/chatting.svg"
                          alt="chatting"
                          onClick={() => handleToChat(aData.id)}
                        />
                      </td>
                      <td className="px-[15px] py-[25px]  border border-[#D3D3D3] text-center">
                        {aData.status === "完了報告" ? (
                          <div className="text-white bg-[#236997] p-[10px] m-[5px] rounded-lg shadow-sm">
                            完了した
                          </div>
                        ) : aData.status === '承認' ? (
                          <Button
                            handleClick={() => handleEndReport(aData.id)}
                            buttonType={ButtonType.PRIMARY}
                          >
                            <span className="text-small">完了報告</span>
                          </Button>
                        ) : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center pt-[200px] text-title text-[#757575]">
                表示する資料がありません。
              </div>
            )}
          </div>
        )}
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
                    className="text-[#3F8DEB] underline hover:cursor-pointer underline-offset-3 sp:text-sp"
                    onClick={() => {
                      setCaseId(aData.id);
                      setShowModal(true);
                    }}
                  >
                    {aData.companyName}
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
                      案件名
                    </div>
                    <span className="mb-[7px] sp:text-spsmall">
                      {aData.caseName}
                    </span>
                  </div>
                  <div className="flex">
                    <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                      案件種別
                    </div>
                    <span className="mb-[7px] sp:text-spsmall">
                      {aData.caseType}
                    </span>
                  </div>
                  <div className="flex">
                    <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                      来店場所
                    </div>
                    <span className="mb-[7px] sp:text-spsmall">
                      {aData.casePlace}
                    </span>
                  </div>
                  <div className="flex">
                    <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                      状態
                    </div>
                    <span className="mb-[7px] sp:text-spsmall">
                      {aData.status}
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
                      />{" "}
                    </span>
                  </div>

                  <div className="flex">
                    {aData.status === "完了報告" ? (
                      <div className="text-white bg-[#236997] p-[10px] m-[5px] rounded-lg shadow-sm">
                        完了した
                      </div>
                    ) : aData.status === '承認' ? (
                      <Button
                        handleClick={() => handleEndReport(aData.id)}
                        buttonType={ButtonType.PRIMARY}
                      >
                        <span className="text-small">完了報告</span>
                      </Button>
                    ) : ''}
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
