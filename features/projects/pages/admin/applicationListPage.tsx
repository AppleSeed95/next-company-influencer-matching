"use client";

import Checkbox from "@/components/atoms/checkbox";
import SearchBar from "@/components/organisms/searchbar";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
// import ReactPaginate from "react-paginate";
import { useRouter } from "next/navigation";


export default function ApplicationListPage() {
  const [active, setActive] = useState(null);
  const [data, setData] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [optionedData, setOptionedData] = useState([]);
  const [options, setOptions] = useState([]);
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
        const result = await axios.get("/api/case");
        if (result.data?.length) {
          const resultData = result.data.filter((aData => !(aData.next > 0)))
          setData(resultData);
          setVisibleData(resultData);
          setOptionedData(resultData);
        }
        setIsLoading(false);
      } catch (e) {
        router.push('/logout')

      }

    };
    fetchData();
    document.title = '申請案件一覧'
  }, []);
  const onItemClick = ({ idx }: { idx: Number }) => {
    if (active === idx) {
      setActive(null);
    } else {
      setActive(idx);
    }
  };
  const makeOptioinedData = (visibleData, result) => {
    if (result.length === 0) {
      setOptionedData(visibleData);
      return;
    }
    let resultData = [];
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
    setOptionedData(resultData);
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
  const dateString = (dateValue: string) => {
    console.log(dateValue);

    const date = new Date(dateValue);
    if (isNaN(date.getUTCFullYear())) {
      console.log('return');

      return "";
    }
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}`;

    return formattedDate;
  }
  return (
    <div className="h-full">
      <div className="flex flex-col h-full px-[30px] sp:px-[12px] pt-[110px] pb-[30px]">
        <div className="text-title sp:hidden">申請案件一覧</div>
        <SearchBar
          data={data.map((aData) => {
            if (aData.caseEnd) aData.caseEnd = dateString(aData.caseEnd);
            aData.duration = `${dateString(aData.collectionStart)} ~ ${dateString(aData.collectionEnd)}`
            return aData;
          })}
          setVisibleData={handleSearch}
          keys={[
            "companyName",
            "caseType",
            "caseName",
            "collectionEnd",
            "collectionStart",
            "date",
          ]}
          extendChild={
            <div>
              <div className="mt-[30px] sp:mt-[10px] text-small text-[#3F8DEB] font-bold">
                条件を絞り込みできます。
              </div>
              <div className="flex mt-[8px] flex-wrap">
                <div className="flex flex-wrap">
                  <span className="mr-[11px] sp:text-sp text-[#A8A8A8]">状態 ： </span>
                  <div className="flex flex-wrap gap-y-[5px]">
                    <Checkbox
                      title={"申請中"}
                      handleChange={(val) => handleOptionChange("申請中")}
                      checkBoxClassName="mr-[20px]"
                    />
                    <Checkbox
                      title={"承認"}
                      handleChange={(val) => handleOptionChange("承認")}
                      checkBoxClassName="mr-[20px]"
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
                      handleChange={(val) => handleOptionChange("否認")}
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
              <table className="w-[100%] text-[14px]">
                <thead>
                  <tr>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] ">
                      企業名
                    </td>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] ">
                      案件種別
                    </td>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                      案件名
                    </td>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                      状態
                    </td>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3]">
                      募集期間
                    </td>
                    <td className="px-[35px] py-[25px] bg-[#F8F9FA] border border-[#D3D3D3] ">
                      申請日時
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {currentItems?.map((aData, idx) => (
                    <tr key={idx}>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3] hover:cursor-pointer text-[#3F8DEB] underline underline-[#3F8DEB] underline-offset-[3px]">
                        <Link href={`/company/${aData.companyId}`}>
                          {aData.companyName}
                        </Link>
                      </td>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3] ">
                        {aData.caseType}
                      </td>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3] hover:cursor-pointer text-[#3F8DEB] underline underline-[#3F8DEB] underline-offset-[3px]">
                        <Link href={`/application/${aData.id}`}>
                          {aData.caseName}
                        </Link>
                      </td>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3]">
                        {aData.status}
                      </td>
                      <td className="px-[35px] py-[25px]  border border-[#D3D3D3]">
                        {`${dateString(aData.collectionStart)} ~ ${dateString(aData.collectionEnd)}`}
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
                該当する案件がありません。
              </div>
            )}
          </div>
        )}
        <div className="sp:hidden">
          {/* <ReactPaginate
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
          /> */}
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
                    <Link href={`/application/${aData.id}`}>
                      {aData.caseName}
                    </Link>
                  </span>
                </div>

                <img
                  src={idx === active ? "/img/up.svg" : "/img/down.svg "}
                  className="inline h-[8px]"
                />
              </div>
              {idx === active && (
                <div className="py-[25px]">
                  <div className="flex py-[5px]">
                    <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                      企業名
                    </div>
                    <span className="mb-[7px] sp:text-spsmall text-[#3F8DEB] underline underline-[#3F8DEB] underline-offset-[3px]">
                      <Link href={`/company/${aData.companyId}`}>
                        {aData.companyName}
                      </Link>
                    </span>
                  </div>
                  <div className="flex py-[5px]">
                    <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                      案件種別
                    </div>
                    <span className="mb-[7px] sp:text-spsmall">
                      {aData.caseType}
                    </span>
                  </div>
                  <div className="flex py-[5px]">
                    <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                      状態
                    </div>
                    <span className="mb-[7px] sp:text-spsmall">
                      {aData.status}
                    </span>
                  </div>
                  <div className="flex py-[5px]">
                    <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                      募集期間
                    </div>
                    <span className="mb-[7px] sp:text-spsmall">
                      {`${dateString(aData.collectionStart)} ~ ${dateString(aData.collectionEnd)}`}
                    </span>
                  </div>
                  <div className="flex py-[5px]">
                    <div className="w-[80px] mr-[36px] text-right text-[#A9A9A9] sp:text-spsmall">
                      申請日時
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
          {/* <ReactPaginate
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
          /> */}
        </div>
      </div>
    </div>
  );
}
