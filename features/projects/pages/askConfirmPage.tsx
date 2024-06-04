"use client";
import { useEffect } from "react";

export default function AskConfirmPage() {
    useEffect(() => {
        document.title = 'お問い合わせ完了';
        localStorage.removeItem("user");
    }, []);
    return (
        <div className="bg-[#F5F5F5] pt-[90px]  flex  grow">
            <div className="bg-[white] px-[20px] w-[614px] sp:w-[90%] rounded-[40px] block m-auto py-[70px] sp:py-[20px] shadow-lg">
                <img
                    src="/img/logo(red).svg"
                    className="blcok m-auto w-[265px] sp:w-[200px] mobile:w-[200px] sp:pt-[20px] mobile:pt-[20px] mb-[50px]"
                />
                <div className=" text-center justify-center w-full items-center mb-[20px] sp:mt-[50px]  ">
                    <div>お問い合わせありがとうございます。</div>
                    <div>内容を確認してご連絡いたします。</div>
                </div>
                {/* <div className="text-center mb-[10px]">
                    <Link href={"/login"}>
                        <Button buttonType={ButtonType.PRIMARY}>ログインページへ</Button>
                    </Link>
                </div> */}
            </div>
        </div>
    );
}
