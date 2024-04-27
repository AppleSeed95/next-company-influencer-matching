"use client";
import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";
import Link from "next/link";
import { useEffect } from "react";

export default function PaymentConfirmPage() {
    useEffect(() => {
        document.title = 'お支払いが成功しました';
    }, [])
    return (
        <div className="bg-[#F5F5F5] pt-[90px] h-full  flex  grow">
            <div className="bg-[white] px-[20px] w-[814px] sp:w-[90%] rounded-[40px] block m-auto py-[70px] sp:py-[20px] shadow-lg">
                <img
                    src="/img/logo(red).svg"
                    className="blcok m-auto w-[265px] sp:hidden mb-[50px]"
                />
                <div className="text-center justify-center w-full items-center mb-[20px] sp:mt-[50px] text-title">
                    <div className="mb-[20px]">インフルエンサーめぐりをご利用いただきありがとうございます。
                    </div>
                    <div>お支払い手続きが完了しましたので機能をご利用いただけます。
                    </div>
                    <div className="mb-[20px]">
                        今後のお支払いはご登録いただいたクレジットカードで処理されます。
                    </div>
                    <div>ご不明な点がございましたらお問い合わせよりご連絡ください。
                    </div>
                </div>
                <div className="text-center mb-[10px]">
                    <Link href={"/companyInfo"}>
                        <Button buttonType={ButtonType.PRIMARY}>企業情報ページへ</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
