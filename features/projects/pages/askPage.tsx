"use client";
import Input from "@/components/atoms/input";
import Checkbox from "@/components/atoms/checkbox";
import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";
import TextArea from "@/components/atoms/textarea";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AskPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [agree, setAgree] = useState(false);
  useEffect(() => {
    document.title = 'お問い合わせ';
  }, [])
  const handleAsk = async () => {
    if (!agree) {
      setError("個人情報の取り扱いに同意する必要があります。");
      return;
    }
    if (!data.name || data.name === "") {
      setError("名前を入力してください。");
      return;
    }
    if (!data.email || data.email === "") {
      setError("メールアドレスを入力してください。");
      return;
    }
    if (!data.emailConfirm || data.emailConfirm === "") {
      setError("メールアドレスの確認を入力してください。");
      return;
    }
    let mailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!mailPattern.test(data.email.trim())) {
      setError("メールアドレス形式ではありません");
      return;
    }
    if (data.email !== data.emailConfirm) {
      setError("メールアドレスが一致しません");
      return;
    }
    await axios.post("/api/sendEmail", {
      to: data.email,
      subject: "【インフルエンサーめぐり】お問い合わせを受け付けました",
      content: `${data.name} 様
          \n
          \n お問い合わせいただき誠にありがとうございます。
          \n下記の内容でお問い合わせを受け付けました。
          \n
          \n内容を確認の上、担当者よりご連絡させていただきます。
          \n-----------------------------------------------------
          \nお問い合わせ内容
          \n
          \nお名前          ：${data.name}
          \nメールアドレス  ：${data.email}
          \nお問い合わせ種別：${data.type ? data.type : ""}
          \nお問い合わせ内容：${data.content ? data.content : ""}
          \n-----------------------------------------------------
          `,
    });
    await axios.post("/api/sendEmail", {
      from: data.email,
      subject: "【インフルエンサーめぐり】お問い合わせがありました",
      content: `インフルエンサーめぐりにお問い合わせがありました。
          \n-----------------------------------------------------
          \nお問い合わせ内容
          \n
          \nお名前          ：${data.name}
          \nメールアドレス  ：${data.email}
          \nお問い合わせ種別：${data.type ? data.type : ""}
          \nお問い合わせ内容：${data.content ? data.content : ""}s
          \n-----------------------------------------------------
          `,
    });
  };
  return (
    <div className="text-center">
      <div className="text-title mt-[200px] sp:mt-[150px]">お問い合わせ</div>
      <div className="flex py-[20px] w-[40%] sp:w-[90%] m-auto border-b-[1px] border-[#DDDDDD] sp:mt-[50px] mt-[90px]">
        <span className="w-[40%] flex justify-end  mt-[7px] mr-[67px]">
          <span>お名前</span>
          <span className="ml-[10px] text-[#EE5736] text-[11px]">必須</span>
        </span>
        <Input
          handleChange={(val) => setData({ ...data, name: val })}
          inputClassName="max-w-[250px] grow border-[#D3D3D3]"
        />
      </div>
      <div className="flex py-[20px] w-[40%] sp:w-[90%] m-auto border-b-[1px] border-[#DDDDDD]">
        <span className="w-[40%] flex justify-end mr-[67px]">
          <span>メールアドレス</span>
          <span className="ml-[10px] text-[#EE5736] text-[11px]">必須</span>
        </span>
        <Input
          format="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
          formatMsg="メールアドレス形式ではありません"
          handleChange={(val) => setData({ ...data, email: val })}
          inputClassName="max-w-[250px] grow border-[#D3D3D3]"
        />
      </div>
      <div className="flex py-[20px] w-[40%] sp:w-[90%] m-auto border-b-[1px] border-[#DDDDDD]">
        <span className="w-[40%] flex justify-end mr-[67px]">
          <span>メールアドレス確認</span>
          <span className="ml-[10px] text-[#EE5736] text-[11px]">必須</span>
        </span>
        <Input
          format="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
          formatMsg="メールアドレス形式ではありません"
          handleChange={(val) => setData({ ...data, emailConfirm: val })}
          inputClassName="max-w-[250px] grow border-[#D3D3D3]"
        />
      </div>
      <div className="flex py-[20px] w-[40%] sp:w-[90%] m-auto border-b-[1px] border-[#DDDDDD]">
        <span className="w-[40%] flex justify-end mr-[67px]">
          <span>お問い合わせ種別</span>
          <span className="ml-[10px] text-[#EE5736] text-[11px] invisible">
            必須
          </span>
        </span>
        <Input
          handleChange={(val) => setData({ ...data, type: val })}
          inputClassName="max-w-[250px] grow border border-[#D3D3D3] h-[33px]"
        ></Input>
      </div>
      <div className="flex py-[20px] w-[40%] sp:w-[90%] m-auto border-b-[1px] border-[#DDDDDD]">
        <span className="w-[40%] flex justify-end  mt-[7px] mr-[67px]">
          <span>お問い合わせ内容</span>
          <span className="ml-[10px] text-[#EE5736] text-[11px] invisible">
            必須
          </span>
        </span>
        {/* <Input inputClassName="max-w-[250px] grow border border-[#D3D3D3] h-[33px]"></Input> */}

        <TextArea
          handleChange={(val) => setData({ ...data, content: val })}
          textAreaClassName="max-w-[390px] grow h-[95px]"
        />
      </div>

      <div className="mt-[25px]">
        ※本システムをご利用の方は、Emailを入力してください。
      </div>
      <div className="flex justify-center">
        <Checkbox
          prefix={""}
          handleChange={(val) => setAgree(val)}
          checkBoxClassName="mt-[36px]"
          title={
            <span>
              <span className="underline decoration-[#353A40] underline-offset-[5px]">
                個人情報の取り扱い
              </span>
              に同意します
            </span>
          }
        />
      </div>
      <div className="text-center mt-[42px]">
        <Button buttonType={ButtonType.PRIMARY} handleClick={handleAsk}>
          確認画面へ
        </Button>
        {error !== "" && (
          <div className="mt-[10px] text-center text-[#EE5736]">{error}</div>
        )}
      </div>
      <div className="mt-[154px] mb-[27px] flex justify-between w-[334px] m-auto text-[#AAAAAA]">
        <span className="underline underline-offset-[5px]">
          個人情報保護方針
        </span>
        <span className="underline underline-offset-[5px]">特定商取引法</span>
        <span className="underline underline-offset-[5px]">利用規約</span>
      </div>
    </div>
  );
}
