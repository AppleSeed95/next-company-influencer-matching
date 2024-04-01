"use client";

import Checkbox from "@/components/atoms/checkbox";
import SearchBar from "@/components/organisms/searchbar";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";

export default function InfluencerListPage() {
  const [active, setActive] = useState(null);
  const [data, setData] = useState([]);
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

  const onItemClick = ({ idx }: { idx: Number }) => {
    if (active === idx) {
      setActive(null);
    } else {
      setActive(idx);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await axios.get("/api/influencer");
      if (result.data?.length) {
        setData(result.data);
        setOptionedData(result.data);
        setVisibleData(result.data);
      }
      setIsLoading(false);
    };
    fetchData();
    document.title = 'インフルエンサー一覧';
  }, []);
  const makeOptioinedData = (visibleData, result, result1) => {
    let resultData = [];
    if (result.length === 0) {
      resultData = visibleData;
    }
    if (result.some((aOption) => aOption === "承認待ち")) {
      resultData = [
        ...resultData,
        ...visibleData.filter((aData) => aData.status === "承認待ち"),
      ];
    }
    if (result.some((aOption) => aOption === "稼働中")) {
      resultData = [
        ...resultData,
        ...visibleData.filter((aData) => aData.status === "稼働中"),
      ];
    }
    if (result.some((aOption) => aOption === "停止中")) {
      resultData = [
        ...resultData,
        ...visibleData.filter((aData) => aData.status === "停止中"),
      ];
    }
    if (result1.length === 0) {
      setOptionedData(resultData);
      return;
    }
    let resultData1 = [];
    if (result1.some((aOption) => aOption === "instagram")) {
      resultData1 = [
        ...resultData1,
        ...resultData.filter((aData) => JSON.parse(aData.instagram)?.account !== "" && !resultData1.some((aResult) => aResult.id === aData.id)),
      ];
    }
    if (result1.some((aOption) => aOption === "tiktok")) {
      resultData1 = [
        ...resultData1,
        ...resultData.filter((aData) => JSON.parse(aData.tiktok)?.account !== "" && !resultData1.some((aResult) => aResult.id === aData.id)),
      ];
    }
    if (result1.some((aOption) => aOption === "x")) {
      resultData1 = [
        ...resultData1,
        ...resultData.filter((aData) => JSON.parse(aData.x)?.account !== "" && !resultData1.some((aResult) => aResult.id === aData.id)),
      ];
    }
    if (result1.some((aOption) => aOption === "facebook")) {
      resultData1 = [
        ...resultData1,
        ...resultData.filter((aData) => JSON.parse(aData.facebook)?.account !== "" && !resultData1.some((aResult) => aResult.id === aData.id)),
      ];
    }
    if (result1.some((aOption) => aOption === "youtube")) {
      resultData1 = [
        ...resultData1,
        ...resultData.filter((aData) => JSON.parse(aData.youtube)?.account !== "" && !resultData1.some((aResult) => aResult.id === aData.id)),
      ];
    }
    if (result1.some((aOption) => aOption === "etc")) {
      resultData1 = [
        ...resultData1,
        ...resultData.filter((aData) => (aData.otherSNS !== "" && aData.otherSNS !== "null" && !resultData1.some((aResult) => aResult.id === aData.id))),
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

  return (
    <div className="h-full">
      <div className="flex flex-col h-full px-[30px] sp:px-[12px] pt-[110px] pb-[30px]">
        <div className="text-title sp:hidden">インフルエンサー一覧</div>
        <SearchBar
          data={data}
          setVisibleData={handleSearch}
          keys={["nickName", "influencerName", "date"]}
          extendChild={
            <div>
              <div className="mt-[30px] sp:mt-[10px] text-small text-[#3F8DEB] font-bold">
                条件を絞り込みできます。
              </div>
              <div className="flex sp:block mt-[8px] gap-x-9 flex-wrap">
                <div className="flex my-[8px]">
                  <Checkbox
                    prefix="状態 ： "
                    title={"承認待ち"}
                    handleChange={(val) => handleOptionChange("承認待ち")}
                    checkBoxClassName="mr-[20px]"
                  />
                  <Checkbox
                    title={"稼働中"}
                    checkBoxClassName="mr-[20px]"
                    handleChange={(val) => handleOptionChange("稼働中")}
                  />
                  <Checkbox
                    title={"停止中"}
                    handleChange={(val) => handleOptionChange("停止中")}
                  />
                </div>
                <div className="flex my-[8px]">
                  <Checkbox
                    // prefix="決算 : "
                    prefix="SNS ： "
                    handleChange={(val) => handleOptionChange1("instagram")}
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
                    handleChange={(val) => handleOptionChange1("tiktok")}
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
                    handleChange={(val) => handleOptionChange1("x")}
                    title={
                      <img className="w-[35px]" src="/img/sns/x.svg" alt="x" />
                    }
                    checkBoxClassName="mr-[20px]"
                  />
                  <Checkbox
                    handleChange={(val) => handleOptionChange1("youtube")}
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
                    handleChange={(val) => handleOptionChange1("facebook")}
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
                    title={"etc"}
                    handleChange={(val) => handleOptionChange1("etc")}
                    checkBoxClassName="mr-[20px]"
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
              <table className="w-[100%] text-[14px] sp:hidden">
                <thead>
                  <tr>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] ">
                      ニックネーム
                    </td>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] ">
                      お名前
                    </td>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                      SNSの種類
                    </td>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                      状態
                    </td>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                      登録・申請日
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {currentItems?.map((aData, idx) => (
                    <tr key={idx}>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3] hover:cursor-pointer text-[#3F8DEB] underline underline-[#3F8DEB] underline-offset-[3px]">
                        <Link href={`/influencer/${aData.id}`}>
                          {aData.nickName}
                        </Link>
                      </td>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3] ">
                        {aData.influencerName}
                      </td>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3]">
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
                              alt="youtube"
                            />
                          )}
                          {aData.otherSNS !== "" && aData.otherSNS !== 'null' && aData.otherSNS !== null && (
                            <span className="text-[#C0C0C0]">etc.</span>
                          )}
                        </div>
                      </td>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3]">
                        {aData.status}
                      </td>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3]">
                        {aData.date}
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
          {currentItems?.map((aData, idx) => {
            return (
              <div
                key={idx}
                className=" bg-[#F8F9FA] border border-[#D3D3D3]"
                onClick={() => onItemClick({ idx })}
              >
                <div className="flex justify-between px-[30px] py-[20px] w-full">
                  <div className="flex">
                    <span className="text-[#3F8DEB] underline hover:cursor-pointer underline-offset-3 sp:text-sp">
                      {aData.nickName}
                    </span>
                  </div>

                  <img
                    src={idx === active ? "/img/up.svg" : "/img/down.svg "}
                    className="inline h-[8px]"
                  />
                </div>
                {idx === active && (
                  <div className="p-[25px]">
                    <div className="flex">
                      <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                        お名前
                      </div>
                      <span className="mb-[7px] sp:text-spsmall">
                        {aData.influencerName}
                      </span>
                    </div>
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
                              alt="youtube"
                            />
                          )}
                          {aData.otherSNS !== "" && aData.otherSNS !== 'null' && aData.otherSNS !== null && (
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
                        {aData.status}
                      </span>
                    </div>
                    <div className="flex">
                      <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                        登録・申請日
                      </div>
                      <span className="mb-[7px] sp:text-spsmall">
                        {aData.date}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

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
