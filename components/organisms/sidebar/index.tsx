"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar() {
  const pathName = usePathname();

  return (
    <div className="bg-[#F8F9FA] min-h-[100vh] w-[264px] sp:hidden duration-200">
      <div className="px-[20px] py-[120px]">
        <div
          className={
            pathName.indexOf("companyList") !== -1
              ? "p-[12px] text-[14px] text-[#3F8DEB]"
              : "p-[12px] text-[14px] "
          }
        >
          <Link href={"/companyList"}>企業一覧</Link>
        </div>
        <div
          className={
            pathName.indexOf("influencerList") !== -1
              ? "p-[12px] text-[14px] text-[#3F8DEB]"
              : "p-[12px] text-[14px] "
          }
        >
          <Link href={"/influencerList"}>インフルエンサー一覧</Link>
        </div>
        <div
          className={
            pathName.indexOf("applicationList") !== -1
              ? "p-[12px] text-[14px] text-[#3F8DEB]"
              : "p-[12px] text-[14px] "
          }
        >
          <Link href={"/applicationList"}>申請案件一覧</Link>
        </div>
        <div
          className={
            pathName.indexOf("notification") !== -1
              ? "p-[12px] text-[14px] text-[#3F8DEB]"
              : "p-[12px] text-[14px] "
          }
        >
          <Link href={"/notification"}>お知らせ更新</Link>
        </div>
      </div>
    </div>
  );
}
