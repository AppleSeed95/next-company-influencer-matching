"use client";

import Checkbox from "@/components/atoms/checkbox";
import SearchBar from "@/components/organisms/searchbar";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/navigation";

export default function CompanyListPage() {
  const [active, setActive] = useState(-1);
  const [options, setOptions] = useState([]);
  const [options1, setOptions1] = useState([]);
  const [data, setData] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [optionedData, setOptionedData] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = optionedData.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(optionedData.length / itemsPerPage);
  const router = useRouter();
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
      try {
        const res = await axios.get("api/company");
        if (res.data?.length) {
          setData(res.data);
          setOptionedData(res.data);
          setVisibleData(res.data);
        }
        setIsLoading(false);
      }
      catch (e) {
        router.push("/logout");
      }
    };
    fetchData();
    document.title = '企業一覧'
  }, []);
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
  const makeOptioinedData = (visibleData, result, result1) => {
    let resultData = [];
    if (result.length === 0) {
      resultData = visibleData;
    }
    if (result.some((aOption) => aOption === "稼動中")) {
      resultData = [
        ...resultData,
        ...visibleData.filter((aData) => aData.status === "稼動中" || aData.status === "稼働中"),
      ];
    }
    if (result.some((aOption) => aOption === "停止中")) {
      resultData = [
        ...resultData,
        ...visibleData.filter((aData) => aData.status === "停止中"),
      ];
    }
    let resultData1 = [];
    if (
      result1.length === 0 ||
      (result1.length === 1 &&
        result1.some((aOption) => aOption === "無料アカウント"))
    ) {
      resultData1 = resultData;
    }
    if (result1.some((aOption) => aOption === "未登録")) {
      resultData1 = [
        ...resultData1,
        ...resultData.filter((aData) => aData.payment === ""),
      ];
    }
    if (result1.some((aOption) => aOption === "失敗")) {
      resultData1 = [
        ...resultData1,
        ...resultData.filter((aData) => aData.payment === "失敗"),
      ];
    }
    if (result1.some((aOption) => aOption === "無料アカウント")) {
      resultData1 = resultData1.filter((aData) => aData.freeAccount === 1 || aData.freeAccount === '1');
    }
    setOptionedData(resultData1.sort((a, b) => -(a.id - b.id)));
  };
  const handleSearch = (data) => {
    setVisibleData(data);
    makeOptioinedData(data, options, options1);
  };
  const onItemClick = ({ idx }: { idx: number }) => {
    if (active === idx) {
      setActive(-1);
    } else {
      setActive(idx);
    }
  };
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
      <div className="flex flex-col h-full px-[30px] sp:px-[12px] pt-[110px] pb-[30px]">
        <div className="text-title sp:hidden">企業一覧</div>
        <SearchBar
          data={composeSearchData(data.map((aData) => {
            if (aData.address) aData.address = aData?.building?.length > 0 ? `${aData?.address} - ${aData?.building}` : aData?.address;
            if (aData.payment) aData.payment = aData.payment.substring(0, 10) + ''
            return aData;
          }))}
          setVisibleData={handleSearch}
          keys={["companyName", "responsibleName", "date"]}
          extendChild={
            <div>
              <div className="mt-[30px] sp:mt-[10px] text-small text-[#3F8DEB] font-bold">
                条件を絞り込みできます。
              </div>
              <div className="flex items-center sp:block mt-[8px] gap-x-9 flex-wrap">
                <div className="flex my-[8px] flex-wrap">
                  <span className="mr-[11px] sp:text-sp text-[#A8A8A8]">状態 ： </span>
                  <Checkbox
                    title={"稼動中"}
                    handleChange={(val) => handleOptionChange("稼動中")}
                    checkBoxClassName="mr-[20px]"
                  />
                  <Checkbox
                    title={"停止中"}
                    handleChange={(val) => handleOptionChange("停止中")}
                  />
                </div>
                <div className="flex my-[8px] flex-wrap">
                  <span className="mr-[11px] sp:text-sp text-[#A8A8A8]">決済 ： </span>
                  <Checkbox
                    title={"未登録"}
                    handleChange={(val) => handleOptionChange1("未登録")}
                    checkBoxClassName="mr-[20px]"
                  />
                  <Checkbox
                    title={"失敗"}
                    handleChange={(val) => handleOptionChange1("失敗")}
                  />
                </div>
                <div className="flex my-[8px] flex-wrap">
                  <span className="mr-[11px] sp:text-sp text-[#A8A8A8]">無料アカウント： </span>
                  <Checkbox
                    handleChange={(val) =>
                      handleOptionChange1("無料アカウント")
                    }
                    title={"無料アカウント"}
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
              <table className="w-[100%] text-[14px] grow">
                <thead>
                  <tr>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] ">
                      企業名
                    </td>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] ">
                      担当者名
                    </td>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                      状態
                    </td>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                      決済
                    </td>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                      無料アカウント
                    </td>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] ">
                      登録日
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {currentItems?.map((aData, idx) => (
                    <tr key={idx}>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3] hover:cursor-pointer text-[#3F8DEB] underline underline-[#3F8DEB] underline-offset-[3px]">
                        <Link href={`/company/${aData.id}`}>
                          {aData.companyName}
                        </Link>
                      </td>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3] ">
                        {aData.responsibleName}
                      </td>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3]">
                        {aData.status}
                      </td>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3]">
                        {aData?.payment.length > 0 ? aData.payment?.substring(0, 10) + '' : ''}
                      </td>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3]">
                        {aData.freeAccount === '1' || aData.freeAccount == 1 ? "無料アカウント" : ""}
                      </td>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3] ">
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
          {currentItems?.map((aData, idx) => (
            <div
              key={idx}
              className=" bg-[#F8F9FA] border border-[#D3D3D3]"
              onClick={() => onItemClick({ idx })}
            >
              <div className="flex justify-between px-[30px] py-[20px] w-full">
                <div className="flex">
                  <span className="text-[#3F8DEB] underline hover:cursor-pointer underline-offset-3 sp:text-sp">
                    <Link href={`/company/${aData.id}`}>
                      {aData.companyName}
                    </Link>
                  </span>

                  {aData.freeAccount ? (
                    <span className="text-[#B3B3B4] ml-[15px] sp:text-spsmall">
                      無料アカウント
                    </span>
                  ) : (
                    ""
                  )}
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
                      担当者名
                    </div>
                    <span className="mb-[7px] sp:text-spsmall">
                      {aData.responsibleName}
                    </span>
                  </div>
                  <div className="flex my-[10px]">
                    <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                      状態
                    </div>
                    <span className="mb-[7px] sp:text-spsmall">
                      {aData.status}
                    </span>
                  </div>
                  <div className="flex my-[10px]">
                    <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                      決算
                    </div>
                    <span className="mb-[7px] sp:text-spsmall">
                      {aData?.payment.length > 0 ? aData.payment?.substring(0, 10) + '' : ''}
                    </span>
                  </div>
                  <div className="flex my-[10px]">
                    <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                      登録日
                    </div>
                    <span className="mb-[7px] sp:text-spsmall">
                      {aData.date}
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
