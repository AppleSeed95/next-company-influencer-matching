"use client";
import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";

import Link from "next/link";

export default function ApplyConfirmPage() {
  return (
    <div className="bg-[#F5F5F5] pt-[90px]  flex  grow">
      <div className="bg-[white] text-center px-[20px] w-[614px] sp:w-[90%] rounded-[40px] block m-auto py-[70px] sp:py-[20px] shadow-lg">
        <img
          src="/img/logo(red).svg"
          className="blcok m-auto w-[265px] sp:w-[200px] mobile:w-[200px] sp:pt-[20px] mobile:pt-[20px] mb-[50px]"
        />
        <div className="m-[50px] mobile:mx-[20px] text-left">
          仮申請ありがとうございます。
          <br />
          <br />
          ご入力いただいたメールアドレスにメールを送信しましたので記載されているURLからご登録をお願いします。
          <br />
          メールが届かない場合は迷惑メールフォルダもご確認ください。
          <br />
          迷惑メールフォルダにも届いていない場合は受信拒否設定をご確認の上、60分以上たってから改めて申請してください。
          <br />
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
