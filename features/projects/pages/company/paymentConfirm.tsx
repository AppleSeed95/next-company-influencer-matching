"use client";
import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import Link from "next/link";
import { authUserState } from "@/recoil/atom/auth/authUserAtom";
import axios from "axios";
import Script from "next/script";

export default function PaymentConfirmPage() {
    const authUser = useRecoilValue(authUserState);
    const [paymentData, setPaymentData] = useState('');

    useEffect(() => {
        document.title = 'お支払いが成功しました';
        const fetchPaymentInfo = async () => {
            const { data: { data } } = await axios.get(`/api/company/aCompany/getPayment?id=${authUser.user?.id}`)
            setPaymentData(data?.paymentId);
        }
        fetchPaymentInfo();
    }, [])
    return (
        <div className="bg-[#F5F5F5] pt-[90px] h-full  flex  grow">
            <div className="bg-[white] px-[20px] w-[814px] sp:w-[90%] rounded-[40px] block m-auto py-[70px] sp:py-[20px] shadow-lg">
                <img
                    src="/img/logo(red).svg"
                    className="blcok m-auto w-[265px] sp:w-[200px] mobile:w-[200px] sp:pt-[20px] mobile:pt-[20px] mb-[50px]"
                />
                {paymentData !== '' && <div>
                    <div className="hidden" id='order-number'>
                        {paymentData}
                    </div>
                    <span id="a8sales"></span>
                    <Script
                        id="order-number-script"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                                var orderNumber = document.getElementById('order-number');
                                a8sales({ "pid": "XXXXXXXXXXXX", "order_number": orderNumber.innerText, }); 
                                `,
                        }}
                    />
                </div>}
                <div className="w-full flex justify-center">
                    <div className="block m-auto">
                        <div className="text-center mobile:text-left mobile:px-[20px] justify-center w-full items-center mb-[20px]">
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
