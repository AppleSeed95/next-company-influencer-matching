"use client";

import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";
import Checkbox from "@/components/atoms/checkbox";
import SearchBar from "@/components/organisms/searchbar";
import ApplicationPage from "../admin/applicationPage";
import { useRecoilValue } from "recoil";
import { useState, useEffect } from "react";
import Modal from "../../utils/modal";
import { authUserState } from "@/recoil/atom/auth/authUserAtom";
import axios from "axios";
import Image from "next/image";
import ReactPaginate from "react-paginate";

export default function CollectedCase() {
  const user = useRecoilValue(authUserState);

  const [active, setActive] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [appliedCase, setAppliedCase] = useState([]);
  const [caseId, setCaseId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [reload, setReload] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");
  const [visibleData, setVisibleData] = useState([]);
  const [optionedData, setOptionedData] = useState([]);
  const [options, setOptions] = useState([]);
  const [options1, setOptions1] = useState([]);
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

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await axios.get("/api/case/influencer");
      if (result.data.length !== 0) {
        setCaseId(result.data[0]?.id);
        if (result.data?.length) {
          setData(result.data);
          setVisibleData(result.data);
          setOptionedData(result.data);
        }
      }
      setIsLoading(false);
      document.title = '募集中案件一覧';
    };
    const fetchApplied = async () => {
      const result = await axios.get(`/api/apply?id=${user.user?.targetId}`);
      if (result.data) setAppliedCase(result.data);
    };
    if (user) {
      fetchApplied();
      fetchData();
    }
  }, [reload]);
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
    if (result.some((aOption) => aOption === "申請中")) {
      resultData1 = [
        ...resultData1,
        ...resultData.filter((aData) => aData.status === "申請中"),
      ];
    }
    if (result.some((aOption) => aOption === "承認")) {
      resultData1 = [
        ...resultData1,
        ...resultData.filter((aData) => aData.status === "承認"),
      ];
    }
    if (result.some((aOption) => aOption === "否認")) {
      resultData1 = [
        ...resultData1,
        ...resultData.filter((aData) => aData.status === "否認"),
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
  const alreadyAppliedOrNot = (caseId: number) => {
    let already = false;
    if (appliedCase.length) {
      already = appliedCase.some((a) => a.caseId === caseId);
    }
    return already;
  };
  const onItemClick = ({ idx }: { idx: Number }) => {
    if (active === idx) {
      setActive(null);
    } else {
      setActive(idx);
    }
  };
  const handleApply = async (caseId: string) => {
    const { targetStatus } = user.user;

    if (targetStatus !== "稼働中") {
      setConfirmMsg("応募できません");
      setShowConfirm(true);
      return;
    }
    const result = await axios.post("/api/apply", {
      caseId,
      influencerId: user.user?.targetId,
    });
    if (result.data.type === "success") {
      setReload(!reload);
      setConfirmMsg("操作が成功しました。");
      setShowConfirm(true);
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
    <div className="h-full">
      <div
        className={
          showConfirm
            ? "bg-black bg-opacity-25 w-full h-full fixed left-0 overflow-auto duration-500"
            : "bg-black bg-opacity-25 w-full h-full fixed left-0 overflow-auto opacity-0 pointer-events-none duration-500"
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
        <div className="text-title sp:hidden">募集中案件一覧</div>
        <SearchBar
          data={data}
          setVisibleData={handleSearch}
          keys={[
            "companyName",
            "caseName",
            "casePlace",
            "collectionStart",
            "collectionEnd",
          ]}
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
                    handleChange={(v) => handleOptionChange("来店")}
                    checkBoxClassName="mr-[20px]"
                  />
                  <Checkbox
                    title={"通販"}
                    checkBoxClassName="mr-[20px]"
                    handleChange={(v) => handleOptionChange("通販")}
                  />
                </div>
                {/* <div className="flex">
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
                    title={"否認"}
                    handleChange={(v) => handleOptionChange1("否認")}
                  />
                </div> */}
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
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] w-[30%]">
                      会社名
                    </td>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] ">
                      案件名
                    </td>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                      案件種別
                    </td>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                      来店場所
                    </td>
                    <td className="text-center w-[100px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                      募集開始
                    </td>
                    <td className="text-center w-[100px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] ">
                      募集終了
                    </td>
                    <td className="w-[150px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] "></td>
                  </tr>
                </thead>
                <tbody>
                  {currentItems?.filter((aItem) => !alreadyAppliedOrNot(aItem.id)).map((aData, idx) => (
                    <tr key={idx}>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3] hover:cursor-pointer">
                        {aData.companyName}
                      </td>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3] ">
                        <span
                          className="text-[#3F8DEB] underline hover:cursor-pointer underline-offset-3 sp:text-sp"
                          onClick={() => {
                            setCaseId(aData.id);
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
                        {dateString(aData.collectionStart)}
                      </td>
                      <td className="text-center w-[100px] py-[25px]  border border-[#D3D3D3] ">
                        {dateString(aData.collectionEnd)}
                      </td>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3] text-center">
                        {!alreadyAppliedOrNot(aData.id) ? (
                          <Button
                            buttonType={ButtonType.PRIMARY}
                            handleClick={() => handleApply(aData.id)}
                          >
                            応募
                          </Button>
                        ) : (
                          <div className="text-white bg-[#236997] p-[10px] rounded-lg shadow-sm">
                            申請済み
                          </div>
                        )}
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
                    {aData.caseName}
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
                      会社名
                    </div>
                    <span className="mb-[7px] sp:text-spsmall">
                      {aData.companyName}
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
                      募集開始
                    </div>
                    <span className="mb-[7px] sp:text-spsmall">
                      {dateString(aData.collectionStart)}
                    </span>
                  </div>
                  <div className="flex">
                    <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                      募集終了
                    </div>
                    <span className="mb-[7px] sp:text-spsmall">
                      {dateString(aData.collectionEnd)}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="mb-[7px] ml-[30px] sp:text-spsmall">
                      {!alreadyAppliedOrNot(aData.id) ? (
                        <Button
                          buttonType={ButtonType.PRIMARY}
                          handleClick={() => handleApply(aData.id)}
                        >
                          応募
                        </Button>
                      ) : (
                        <div className="text-white bg-[#236997] p-[10px] rounded-lg shadow-sm">
                          申請済み
                        </div>
                      )}
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
