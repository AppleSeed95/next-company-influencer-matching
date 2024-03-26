"use client";
import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";
import Link from "next/link";
import { useEffect } from "react";

export default function PaymentRequirePage() {
    useEffect(() => {
        document.title = '支払いが必要です';
    }, [])
    return (
        <div className="bg-[#F5F5F5] pt-[90px] h-full  flex  grow">
            <div className="bg-[white] px-[20px] w-[614px] sp:w-[90%] rounded-[40px] block m-auto py-[70px] sp:py-[20px] shadow-lg">
                <img
                    src="/img/logo(red).svg"
                    className="blcok m-auto w-[265px] sp:hidden mb-[50px]"
                />
                <div className="flex text-center justify-center w-full items-center mb-[20px] sp:mt-[50px] text-title">
                    <span>支払いが必要です。</span>
                </div>
                <div className="text-center mb-[10px]">
                    <Link href={"/companyInfo"}>
                        <Button buttonType={ButtonType.PRIMARY}>決済情報変更</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
