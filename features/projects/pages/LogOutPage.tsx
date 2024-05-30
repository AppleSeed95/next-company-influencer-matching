"use client";
import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";
import Link from "next/link";
import { useEffect } from "react";

export default function LogOutPage() {
  useEffect(() => {
    document.title = 'ログアウト';
    localStorage.removeItem("user");
  }, []);
  return (
    <div className="bg-[#F5F5F5] pt-[90px]  flex  grow">
      <div className="bg-[white] px-[20px] w-[614px] sp:w-[90%] rounded-[40px] block m-auto py-[70px] sp:py-[20px] shadow-lg">
        <img
          src="/img/logo(red).svg"
          className="blcok m-auto sp:w-[200px] mobile:w-[200px] sp:pt-[20px] mobile:pt-[20px] w-[265px] mb-[50px]"
        />
        <div className="flex text-center justify-center w-full items-center mb-[20px] sp:mt-[50px] text-title">
          <span>ログアウトしました。</span>
        </div>
        <div className="text-center mb-[10px]">
          <Link href={"/login"}>
            <Button buttonType={ButtonType.PRIMARY}>ログインページへ</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
