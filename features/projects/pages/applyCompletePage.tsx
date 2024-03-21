"use client";
import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";
import Link from "next/link";

export default function ApplyCompletePage() {
  return (
    <div className="bg-[#F5F5F5] pt-[90px]  flex  grow">
      <div className="bg-[white] text-center px-[20px] w-[614px] sp:w-[90%] rounded-[40px] block m-auto py-[70px] sp:py-[20px] shadow-lg">
        <img
          src="/img/logo(red).svg"
          className="blcok m-auto w-[265px] sp:hidden mb-[50px]"
        />
        <div className="m-[50px] text-left">
          〇〇サービスにご申請ありがとうございます。 <br />
          内容を確認しますのでしばらくお待ちください。
          <br />
          不明点がございましたらお問い合わせフォームからご連絡ください。
          <br />
        </div>

        <Link href={"/ask"}>
          <div className="text-center mb-[10px]">
            <Button buttonType={ButtonType.PRIMARY}>
              お問い合わせはこちら
            </Button>
          </div>
        </Link>
      </div>
    </div>
  );
}
