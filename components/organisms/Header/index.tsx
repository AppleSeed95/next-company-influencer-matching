"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRecoilValue, useRecoilState } from "recoil";
import { authUserState } from "@/recoil/atom/auth/authUserAtom";
import { useRouter } from "next/navigation";
export interface Headerprops {
  mode: string;
}

const Header: React.FC<Headerprops> = ({ mode }: Headerprops) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    setIsClient(true);
    const fitTextInDiv = () => {
      const container = containerRef.current;
      if (!container) return;

      let containerWidth = container.clientWidth;
      let length = containerRef.current.innerHTML.length;
      let newFontSize = containerWidth / length;

      // Adjust font size to fit the content
      if (containerWidth < 500) {
        container.style.fontSize = `${newFontSize < 20 ? newFontSize : 20}px`;
      } else {
        container.style.fontSize = `20px`;
      }
    };

    fitTextInDiv();
    window.addEventListener('resize', fitTextInDiv); // Adjust on window resize
    return () => window.removeEventListener('resize', fitTextInDiv);
  }, []); // Re-run effect when fontSize or children change
  const authUser = useRecoilValue(authUserState);
  const router = useRouter();
  return mode === "auth" ? (
    <div
      key={"auth"}
      className="h-[90px] bg-[white] flex justify-between items-center px-[25px] absolute top-0 w-full shadow-lg"
    >
      <img src="/img/logo(red).svg" className="h-[51px] sp:w-[30%]" />
      <div className="flex">
        <Link href={"/ask"}>
          <button className="h-[37px] bg-[black] text-white py-[10px] px-[30px] sp:px-[10px] justify-center flex items-center rounded-[30px] mr-[30px] sp:mr-[10px]">
            <img
              src="/img/mail.svg"
              className="w-[20px] mr-[10px] sp:mr-[0px]"
            />
            <span className="sp:hidden">お問い合わせ</span>
          </button>
        </Link>
        <Link href={"/apply"}>
          <button className="h-[37px] bg-[#FF2929] text-white py-[10px] px-[30px] sp:px-[10px] justify-center flex items-center rounded-[30px] mr-[70px] sp:mr-[10px]">
            <img
              src="/img/brand.svg"
              className="w-[15px] mr-[10px] sp:mr-[0px]"
            />
            <span className="sp:hidden">お申し込み</span>
          </button>
        </Link>
      </div>
    </div>
  ) : (
    <div
      key={"main"}
      className="flex h-[64px] w-full absolute sp:flex-col shadow-lg"
    >
      <div className="bg-[#FF2929] h-[full] px-[15px] flex items-center sp:w-[100%] sp:py-[7px]">
        <img src="/img/logo(white).svg" className="sp:hidden" />
        <img src="/img/Vector.svg" className="lg:hidden mx-auto" />
      </div>
      <div className="flex justify-between items-center w-full bg-[#494D53] sp:py-[14px]">
        <img
          alt="img"
          src="/img/hamburger.svg"
          className="lg:hidden h-[14px] ml-[22px]"
          onClick={() => {
            setShowMenu(!showMenu);
          }}
        />
        <div
          ref={containerRef}
          className="text-[white] w-[70%] mx-[20px] sp:mx-[0px] sp:text-center h-[full] text-[16px]">
          {isClient && authUser.user?.targetName}
        </div>
        <img
          alt="img"
          src="/img/logout.svg"
          className="lg:hidden h-[14px] mr-[22px]"
          onClick={() => {
            if (typeof window !== "undefined") {
              router.push("/logout");
            }
          }}
        />
        <div
          className="text-[white] h-[full] flex items-center mr-[32px] sp:hidden cursor-pointer"
          onClick={() => {
            if (typeof window !== "undefined") {
              router.push("/logout");
            }
          }}
        >
          ログアウト
        </div>
      </div>
      <div
        className={
          showMenu
            ? "relative lg:hidden"
            : "relative lg:hidden opacity-0"
        }
      >
        <div
          className={
            showMenu
              ? "bg-[#8F8F8F] z-10 text-[white] absolute"
              : "bg-[#8F8F8F] z-10 text-[white] absolute pointer-events-none"
          }
        >
          <div className="px-[20px]">
            {mode === "admin" && [
              <div
                key={"admin1"}
                className="p-[12px] text-[14px]"
                onClick={() => setShowMenu(false)}
              >
                <Link href={"/companyList"}>企業一覧</Link>
              </div>,
              <div
                key={"admin2"}
                className="p-[12px] text-[14px]"
                onClick={() => setShowMenu(false)}
              >
                <Link href={"/influencerList"}>インフルエンサー一覧</Link>
              </div>,
              <div
                key={"admin3"}
                className="p-[12px] text-[14px]"
                onClick={() => setShowMenu(false)}
              >
                <Link href={"/applicationList"}>申請案件一覧</Link>
              </div>,
              <div
                key={"admin4"}
                className="p-[12px] text-[14px]"
                onClick={() => setShowMenu(false)}
              >
                <Link href={"/notification"}>お知らせ更新</Link>
              </div>,
              <div
                key={"admin5"}
                className="p-[12px] text-[14px]"
                onClick={() => setShowMenu(false)}
              >
                <Link href={"/planManage"}>プラン管理</Link>
              </div>,
            ]}
            {mode === "company" && [
              <div
                key={"company1"}
                className="p-[12px] text-[14px]"
                onClick={() => setShowMenu(false)}
              >
                <Link href={"/top"}>TOP</Link>
              </div>,
              <div
                key={"company2"}
                className="p-[12px] text-[14px]"
                onClick={() => setShowMenu(false)}
              >
                <Link href={"/appliedList"}>登録案件一覧</Link>
              </div>,
              <div
                key={"company3"}
                className="p-[12px] text-[14px]"
                onClick={() => setShowMenu(false)}
              >
                <Link href={"/case"}>案件の新規登録</Link>
              </div>,
              <div
                key={"company4"}
                className="p-[12px] text-[14px]"
                onClick={() => setShowMenu(false)}
              >
                <Link href={"/companyInfo"}>企業情報変更</Link>
              </div>,
              <div
                key={"company5"}
                className="p-[12px] text-[14px]"
                onClick={() => setShowMenu(false)}
              >
                <Link href={"/pdfdownload"}>マニュアル</Link>
              </div>,
              <div
                key={"company6"}
                className="p-[12px] text-[14px]"
                onClick={() => setShowMenu(false)}
              >
                <Link href={"/ask"}>運営へのお問い合わせ</Link>
              </div>,
            ]}
            {mode === "influencer" && [
              <div
                key={"influencer1"}
                className="p-[12px] text-[14px]"
                onClick={() => setShowMenu(false)}
              >
                <Link href={"/influencerTop"}>TOP</Link>
              </div>,
              <div
                key={"influencer2"}
                className="p-[12px] text-[14px]"
                onClick={() => setShowMenu(false)}
              >
                <Link href={"/appliedCase"}>応募案件一覧</Link>
              </div>,
              <div
                key={"influencer3"}
                className="p-[12px] text-[14px]"
                onClick={() => setShowMenu(false)}
              >
                <Link href={"/collectingCase"}>募集中案件一覧</Link>
              </div>,
              <div
                key={"influencer4"}
                className="p-[12px] text-[14px]"
                onClick={() => setShowMenu(false)}
              >
                <Link href={"/chattingInf"}>チャット </Link>
              </div>,
              <div
                key={"influencer5"}
                className="p-[12px] text-[14px]"
                onClick={() => setShowMenu(false)}
              >
                <Link href={"/influencerInfo"}>インフルエンサー情報変更</Link>
              </div>,
              <div
                key={"influencer6"}
                className="p-[12px] text-[14px]"
                onClick={() => setShowMenu(false)}
              >
                <Link href={"/ask"}>マニュアル</Link>
              </div>,
              <div
                key={"influencer7"}
                className="p-[12px] text-[14px]"
                onClick={() => setShowMenu(false)}
              >
                <Link href={"/ask"}>運営へのお問い合わせ</Link>
              </div>,
            ]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
