"use client";
import Input from "@/components/atoms/input";
import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";
import RadioBtn from "@/components/atoms/radio";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ApplyPage() {
  const [type, setType] = useState("企業");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    document.title = '申し込みページ';
  }, [])
  const onAppy = async () => {
    if (isLoading) return;
    if (email === "") {
      setError("メールアドレスを入力する必要があります。");
      return;
    }
    let mailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!mailPattern.test(email.trim())) {
      setError("メールアドレス形式ではありません");
      return;
    }
    setIsLoading(true);
    const result = await axios.put("api/user", { email, type });
    if (result.data.type === "success") {

      await axios.post("/api/sendEmail", {
        to: email,
        subject: "【インフルエンサーめぐり】仮申請ありがとうございます",
        html: `
        <div>インフルエンサーめぐりに仮申請いただきありがとうございます。
        <br/> 以下のURLから登録申請をお願いします。
        <br/>※メール本文中のURLを60分以内にクリックしてください。
        <br/>https://influencer-meguri.jp/${type === "企業" ? "applyCompany" : "applyInfluencer"
          }?id=${result.data.data.hash}
        <br/>-----------------------------------------------------
        <br/> 不明点がございましたらお問い合わせフォームよりご連絡ください。
        </div>
        https://influencer-meguri.jp/ask'`,
      });
      if (typeof window !== "undefined") {
        router.push("/applyConfirm");
      }
    } else {
      if (result.data.msg) setError(result.data.msg);
    }
    setIsLoading(false);
  };
  return (
    <div className="bg-[#F5F5F5] pt-[90px]  flex  grow sp:text-[black]">
      <div className="bg-[white] text-center px-[20px] w-[614px] sp:w-[90%] rounded-[40px] block m-auto py-[70px] sp:py-[20px] shadow-lg">
        <img
          src="/img/logo(red).svg"
          className="blcok m-auto w-[265px] sp:hidden mb-[50px]"
        />
        <div className="m-[50px] text-center">
          <div className="py-[10px]">
            インフルエンサーめぐりをご覧いただきありがとうございます。
          </div>
          <div className="py-[10px]">
            {type === "企業"
              ? "企業登録をご希望の方は以下から仮申請をしてください。"
              : "インフルエンサー登録をご希望の方は以下から仮申請をしてください。"}
          </div>
          <div className="py-[10px]">
            ご入力いただいたメールアドレス宛に申請フォームをお送りします。
          </div>
        </div>
        <div className="flex items-center justify-center py-[20px] w-[60%] sp:w-full m-auto">
          <div className="flex">
            <RadioBtn
              defaultValue={type}
              handleChange={(val) => setType(val)}
              options={["企業", "インフルエンサー"]}
            />
          </div>
        </div>
        <div className="flex justify-center w-full mt-[30px] mb-[20px] pr-[70px] sp:pr-[30px] sp:mb-[30px]">
          <span className="mr-[20px] mt-[5px] w-[100px] text-right">
            メールアドレス
          </span>
          <Input
            handleChange={(val) => setEmail(val)}
            inputClassName={"max-w-[250px] grow"}
          />
        </div>
        <div className="text-center mb-[10px]">
          <Button handleClick={onAppy} buttonType={ButtonType.PRIMARY}>
            <div className="flex items-center">
              {isLoading ? (
                <img
                  src="/img/refresh.svg"
                  alt="rotate"
                  className="mr-[5px] rotate"
                />
              ) : (
                ""
              )}
              送信する
            </div>
          </Button>
        </div>
        {error !== "" && (
          <div className="text-center text-[#EE5736]">{error}</div>
        )}
      </div>
    </div>
  );
}
