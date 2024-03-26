"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CompanySidebar() {
  const pathName = usePathname();

  return (
    <div className="bg-[#F8F9FA] min-h-[100vh] w-[264px] sp:hidden duration:200 ">
      <div className=" pt-[120px] pb-[30px]  px-[20px] ">
        <div
          className={
            pathName.indexOf("top") !== -1
              ? "p-[12px] text-[14px] text-[#3F8DEB]"
              : "p-[12px] text-[14px] "
          }
        >
          <Link href={"/top"}>TOP</Link>
        </div>
        <div
          className={
            pathName.indexOf("appliedList") !== -1
              ? "p-[12px] text-[14px] text-[#3F8DEB]"
              : "p-[12px] text-[14px] "
          }
        >
          <Link href={"/appliedList"}>登録案件一覧</Link>
        </div>
        <div
          className={
            pathName.indexOf("case") !== -1
              ? "p-[12px] text-[14px] border-b border-gray-300 pb-[30px] text-[#3F8DEB]"
              : "p-[12px] text-[14px] border-b border-gray-300 pb-[30px] "
          }
        >
          <Link href={"/case"}>案件の新規登録</Link>
        </div>
      </div>
      <div
        className={
          pathName.indexOf("companyInfo") !== -1
            ? "pb-[20px] px-[20px]  text-[#3F8DEB]"
            : "pb-[20px] px-[20px]  "
        }
      >
        <span className="text-[#A8A8A8]">設定</span>
        <div className="p-[12px] text-[14px] border-b border-gray-300 pb-[30px]">
          <Link href={"/companyInfo"}>企業情報変更</Link>
        </div>
      </div>
      <div className=" pb-[30px] px-[20px]">
        <div className="p-[12px] text-[14px]">
          <Link href={"/pdfdownload"}>マニュアル</Link>
        </div>
        <div className="p-[12px] text-[14px]">
          <Link href={"/ask"}>運営へのお問い合わせ</Link>
        </div>
      </div>
    </div>
  );
}
