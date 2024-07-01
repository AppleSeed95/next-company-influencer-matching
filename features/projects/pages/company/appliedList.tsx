"use client";

import Checkbox from "@/components/atoms/checkbox";
import SearchBar from "@/components/organisms/searchbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser } from "../../utils/getUser";
import axios from "axios";
import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";
import Image from "next/image";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/navigation";

export default function AppliedList() {
  const [active, setActive] = useState(null);
  const user = getUser();
  const [data, setData] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [optionedData, setOptionedData] = useState([]);
  const [options, setOptions] = useState([]);
  const [options1, setOptions1] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await axios.get(
          `/api/case/company?id=${user.user?.targetId}`
        );
        if (result.data?.length) {
          const resultData = result.data.filter((aData => !(aData.next > 0)));

          setData(resultData);
          setVisibleData(resultData);
          setOptionedData(resultData);
          setIsLoading(false);
        }
        setIsLoading(false);
      } catch (e) {
        router.push('/logout')
      }
    };
    if (user) fetchData();
    document.title = '登録案件一覧'
  }, []);
  const makeOptioinedData = (visibleData, result, result1) => {
    let resultData = [];
    if (result.length === 0) {
      resultData = visibleData;
    }
    if (result.some((aOption) => aOption === "申請前")) {
      resultData = [
        ...resultData,
        ...visibleData.filter((aData) => aData.status === "申請前"),
      ];
    }
    if (result.some((aOption) => aOption === "申請中")) {
      resultData = [
        ...resultData,
        ...visibleData.filter((aData) => aData.status === "申請中"),
      ];
    }
    if (result.some((aOption) => aOption === "承認")) {
      resultData = [
        ...resultData,
        ...visibleData.filter((aData) => aData.status === "承認"),
      ];
    }
    if (result.some((aOption) => aOption === "承認 / 申請中")) {
      resultData = [
        ...resultData,
        ...visibleData.filter((aData) => aData.status === "承認 / 申請中"),
      ];
    }
    if (result.some((aOption) => aOption === "承認 / 否認")) {
      resultData = [
        ...resultData,
        ...visibleData.filter((aData) => aData.status === "承認 / 否認"),
      ];
    }
    if (result.some((aOption) => aOption === "否認")) {
      resultData = [
        ...resultData,
        ...visibleData.filter((aData) => aData.status === "否認"),
      ];
    }
    if (result1.length === 0) {
      setOptionedData(resultData);
      return;
    }

    let resultData1 = [];
    if (result1.some((aOption) => aOption === "募集中")) {
      resultData1 = [
        ...resultData1,
        ...resultData.filter((aData) => aData.collectionStatus === "募集中"),
      ];
    }
    if (result1.some((aOption) => aOption === "募集終了")) {
      resultData1 = [
        ...resultData1,
        ...resultData.filter((aData) => aData.collectionStatus === "募集終了"),
      ];
    }
    if (result1.some((aOption) => aOption === "停止")) {
      resultData1 = [
        ...resultData1,
        ...resultData.filter((aData) => aData.collectionStatus === "停止中"),
      ];
    }
    if (result1.some((aOption) => aOption === "完了")) {
      resultData1 = [
        ...resultData1,
        ...resultData.filter((aData) => aData.collectionStatus === "完了"),
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
  const dateString = (dateValue: string) => {
    const date = new Date(dateValue);
    if (isNaN(date.getFullYear())) {
      return "";
    }
    const formattedDate = `${date.getUTCFullYear()}/${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCDate().toString().padStart(2, '0')} ${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`;
    return formattedDate;
  }
  const composeSearchData = (data) =>
  (data.map((aData) => {
    const keys = Object.keys(aData);
    let stringifiedAData = {};
    keys.map((aKey) => {
      stringifiedAData[aKey] = aData[aKey] + '';
    })
    return stringifiedAData;
  })
  )

  return (
    <div className="h-full">
      <div className="flex flex-col h-full px-[30px] sp:px-[12px] pt-[110px] pb-[30px]">
        <div className="text-title sp:hidden">登録案件一覧</div>
        <Link href={"/case"}>
          <Button
            buttonType={ButtonType.PRIMARY}
            buttonClassName="mt-[15px] sp:my-[15px] sp:text-small rounded-[0px]"
          >
            <span className="flex">
              <img src="/img/plus.svg" alt="plus" className="mr-[5px]" />
              新規登録
            </span>
          </Button>
        </Link>
        <SearchBar
          // data={data}
          data={composeSearchData(data.map((aData) => {
            if (aData.collectionStart) aData.collectionStart = dateString(aData.collectionStart);
            if (aData.collectionEnd) aData.collectionEnd = dateString(aData.collectionEnd);
            return aData;
          }))}
          setVisibleData={handleSearch}
          keys={["caseName", "caseType", "collectionStart", "collectionEnd"]}
          extendChild={
            <div>
              <div className="mt-[20px] sp:mt-[10px] text-small text-[#3F8DEB] font-bold">
                条件を絞り込みできます。
              </div>
              <div className="flex sp:flex:column mt-[8px] flex-wrap gap-x-10 gap-y-3">
                <div className="flex flex-wrap">
                  <span className="mr-[11px] sp:text-sp text-[#A8A8A8]">申請状態 ：  </span>
                  <div className="flex flex-wrap">
                    <Checkbox
                      title={"申請前"}
                      handleChange={(v) => handleOptionChange("申請前")}
                      checkBoxClassName="mr-[20px]"
                    />
                    <Checkbox
                      title={"申請中"}
                      checkBoxClassName="mr-[20px]"
                      handleChange={(v) => handleOptionChange("申請中")}
                    />
                    <Checkbox
                      title={"承認"}
                      checkBoxClassName="mr-[20px]"
                      handleChange={(v) => handleOptionChange("承認")}
                    />
                    <Checkbox
                      title={"承認 / 申請中"}
                      checkBoxClassName="mr-[20px]"
                      handleChange={(v) => handleOptionChange("承認 / 申請中")}
                    />
                    <Checkbox
                      title={"承認 / 否認	"}
                      checkBoxClassName="mr-[20px]"
                      handleChange={(v) => handleOptionChange("承認 / 否認")}
                    />
                    <Checkbox
                      title={"否認"}
                      handleChange={(v) => handleOptionChange("否認")}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap">
                  <span className="mr-[11px] sp:text-sp text-[#A8A8A8]">募集状態 ： </span>
                  <div className="flex flex-wrap">
                    <Checkbox
                      title={"募集中"}
                      handleChange={(v) => handleOptionChange1("募集中")}
                      checkBoxClassName="mr-[20px]"
                    />
                    <Checkbox
                      title={"募集終了"}
                      checkBoxClassName="mr-[20px]"
                      handleChange={(v) => handleOptionChange1("募集終了")}
                    />
                    <Checkbox
                      title={"停止"}
                      checkBoxClassName="mr-[20px]"
                      handleChange={(v) => handleOptionChange1("停止")}
                    />
                    <Checkbox
                      title={"完了"}
                      handleChange={(v) => handleOptionChange1("完了")}
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
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] ">
                      案件種別
                    </td>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] ">
                      案件名
                    </td>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                      申請状態
                    </td>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                      募集状態
                    </td>
                    <td className="text-center w-[100px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                      募集開始
                    </td>
                    <td className="text-center w-[100px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] ">
                      募集終了
                    </td>
                    <td className="w-[70px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] text-center ">
                      詳細
                    </td>
                    <td className="w-[70px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] text-center  ">
                      編集
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {currentItems?.map((aData, idx) => (
                    <tr key={idx}>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3]">
                        {aData.caseType}
                      </td>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3] ">
                        {aData.caseName}
                      </td>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3]">
                        {aData.status}
                      </td>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3]">
                        {aData.collectionStatus}
                      </td>
                      <td className="text-center w-[100px] py-[25px]  border border-[#D3D3D3]">
                        {dateString(aData.collectionStart)}
                      </td>
                      <td className="text-center w-[100px] py-[25px]  border border-[#D3D3D3] ">
                        {dateString(aData.collectionEnd)}
                      </td>
                      <td className="py-[25px]  border border-[#D3D3D3]">
                        <Link href={`/caseDetail/${aData.id}`}>
                          <img
                            src="/img/detail.svg"
                            alt="detail"
                            className="m-auto"
                          />
                        </Link>
                      </td>
                      <td className="py-[25px]  border border-[#D3D3D3] ">
                        <Link href={`/case/${aData.id}`}>
                          <img
                            src="/img/edit.svg"
                            alt="edit"
                            className="m-auto"
                          />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center pt-[200px] text-title text-[#757575]">
                該当する案件がありません。
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
            <div
              key={idx}
              className=" bg-[#F8F9FA] border border-[#D3D3D3]"
              onClick={() => onItemClick({ idx })}
            >
              <div className="flex justify-between px-[30px] py-[20px] w-full">
                <div className="flex">
                  <span className="sp:text-sp">
                    <span >
                      {aData.caseName}
                    </span>
                  </span>
                </div>

                <img
                  src={idx === active ? "/img/up.svg" : "/img/down.svg "}
                  className="inline h-[8px]"
                />
              </div>
              {idx === active && (
                <div className="px-[25px] py-[10px]">
                  <div className="flex my-[10px]">
                    <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                      案件種別
                    </div>
                    <span className="mb-[7px] sp:text-spsmall">
                      {aData.caseType}
                    </span>
                  </div>
                  <div className="flex my-[10px]">
                    <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                      申請状態
                    </div>
                    <span className="mb-[7px] sp:text-spsmall">
                      {aData.status}
                    </span>
                  </div>
                  <div className="flex my-[10px]">
                    <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                      募集状態
                    </div>
                    <span className="mb-[7px] sp:text-spsmall">
                      {aData.collectionStatus}
                    </span>
                  </div>
                  <div className="flex my-[10px]">
                    <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                      募集開始
                    </div>
                    <span className="mb-[7px] sp:text-spsmall">
                      {dateString(aData.collectionStart)}
                    </span>
                  </div>
                  <div className="flex my-[10px]">
                    <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                      募集終了
                    </div>
                    <span className="mb-[7px] sp:text-spsmall">
                      {dateString(aData.collectionEnd)}
                    </span>
                  </div>
                  <div className="flex my-[10px]">
                    <div className="w-[80px] mr-[36px] text-right text-[#3F8DEB] underline hover:cursor-pointer underline-offset-3 sp:text-spsmall ">
                      <Link href={`/caseDetail/${aData.id}`}>詳細</Link>
                    </div>
                  </div>
                  <div className="flex my-[10px]">
                    <div className="w-[80px] mr-[36px] text-right text-[#3F8DEB] underline hover:cursor-pointer underline-offset-3 sp:text-spsmall ">
                      <Link href={`/case/${aData.id}`}>編集</Link>
                    </div>
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
