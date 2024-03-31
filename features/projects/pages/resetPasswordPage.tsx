"use client";
import Input from "@/components/atoms/input";
import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    document.title = 'パスワードを再設定する';
  }, [])
  const handlePasswordChange = async () => {
    setIsLoading(true);
    const result = await axios.post("/api/user/passwordReset", { email });
    if (result.data.type === "success") {

      await axios.post("/api/sendEmail", {
        to: result.data.data.email,
        subject: "【インフルエンサーめぐり】パスワード再発行",
        content: `
          \n いつもインフルエンサーめぐりをご利用いただきありがとうございます。
          \nパスワードを再発行しましたのでご確認をお願いします。
          \n
          \n-----------------------------------------------------
          \n▼アカウント情報
          \nパスワード：
          \n${result.data.data.password}
          \n----------------------------------------------------- 
          \n不明点がございましたらお問い合わせフォームよりご連絡ください。
          \n https://influencer-meguri.jp/ask。
          `,
      });
      setIsLoading(false);
      if (typeof window !== "undefined") {
        router.push("/login");
      }
    } else if (result.data.type === "error") {
      setError(result.data.msg);
    }
  };
  return (
    <div className="bg-[#F5F5F5] pt-[90px]  flex  grow">
      <div className="bg-[white] text-center px-[20px] w-[614px] sp:w-[90%] rounded-[40px] block m-auto py-[70px] sp:py-[20px] shadow-lg">
        <img
          src="/img/logo(red).svg"
          className="blcok m-auto w-[265px] sp:hidden mb-[50px]"
        />
        <span className="my-[30px]">
          パスワード変更するIDを入力してください
        </span>
        <div className="flex justify-center w-full items-center  mt-[30px] mb-[20px] pr-[70px] sp:pr-[30px] sp:mb-[30px]">
          <span className="mr-[20px] w-[70px] text-right">Email</span>
          <Input
            handleChange={(val) => setEmail(val)}
            inputClassName={"max-w-[250px] grow"}
          />
        </div>
        <div className="text-center mb-[10px]">
          <Button
            buttonType={ButtonType.PRIMARY}
            buttonClassName="mr-[30px]"
            handleClick={() => handlePasswordChange()}
          >
            <span className="flex ">
              <span>申請</span>
              <img
                className={
                  isLoading ? "rotate w-[14px] ml-[5px]" : "w-[14px] ml-[5px]"
                }
                src={isLoading ? "/img/refresh.svg" : "/img/apply.svg"}
                alt="refresh"
              />
            </span>
          </Button>
        </div>
        {error !== "" && (
          <div className="text-center text-[#EE5736]">{error}</div>
        )}
      </div>
    </div>
  );
}
