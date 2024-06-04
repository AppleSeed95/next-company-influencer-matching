"use client";
import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";
import Link from "next/link";

import GoogleCaptchaWrapper from "@/app/google-captcha-wrapper";
import { useReCaptcha } from "next-recaptcha-v3";

export default function ApplyInfluencerCompletePage() {
  return (
    <GoogleCaptchaWrapper>

      <div className="bg-[#F5F5F5] pt-[90px]  flex  grow">
        <div className="bg-[white] text-center px-[20px] w-[614px] sp:w-[90%] rounded-[40px] block m-auto py-[70px] sp:py-[20px] shadow-lg">
          <img
            src="/img/logo(red).svg"
            className="blcok m-auto w-[265px] sp:w-[200px] mobile:w-[200px] sp:pt-[20px] mobile:pt-[20px] mb-[50px]"
          />
          <div className="m-[50px] mobile:mx-[20px] text-left">
            ご申請ありがとうございます。
            <br /> <br />
            ご申請いただいた内容を確認しますのでしばらくお待ちください。
            <br />
            確認後にご登録いただいたメールアドレスにご連絡します。
            <br /><br />
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
    </GoogleCaptchaWrapper>
  );
}
