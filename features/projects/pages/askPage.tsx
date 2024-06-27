"use client";
import Input from "@/components/atoms/input";
import Checkbox from "@/components/atoms/checkbox";
import Button from "@/components/atoms/button";
import Select from "@/components/atoms/select";
import { ButtonType } from "@/components/atoms/buttonType";
import TextArea from "@/components/atoms/textarea";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GoogleCaptchaWrapper from "@/app/google-captcha-wrapper";


import { useReCaptcha } from "next-recaptcha-v3";




export default function AskPageContent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState([]);
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [token, setToken] = useState('');
  useEffect(() => {
    document.title = 'お問い合わせ';
  }, [])

  const { executeRecaptcha, loaded } = useReCaptcha();

  const handleAsk = useCallback(
    async () => {
      setIsLoading(true);
      const errorList = [];

      if (!data.name || data.name === "") {
        errorList.push('名前を入力してください。');
      }
      if (!data.email || data.email === "") {
        errorList.push('メールアドレスを入力してください。');
      }
      if (!data.emailConfirm || data.emailConfirm === "") {
        errorList.push('メールアドレスの確認を入力してください。');
      }
      let mailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (data.email?.length > 0 && !mailPattern.test(data.email?.trim())) {
        errorList.push('メールアドレス形式ではありません');
      }
      if (data.email !== data.emailConfirm) {
        errorList.push('メールアドレスが一致しません');
      }

      if (!data.type || data.type === "") {
        errorList.push('お問い合わせの種類を選択してください。');
      }
      if (!data.content || data.content === "") {
        errorList.push('お問い合わせ内容を入力してください。');
      }
      if (!agree) {
        errorList.push('個人情報の取り扱いに同意する必要があります。');
      }
      if (errorList.length > 0) {
        setError(errorList);
        setIsLoading(false);
        return;
      }
      setError([]);
      if (loaded) {
        const token = executeRecaptcha ? await executeRecaptcha("form_submit") : '';
        const response = await axios({
          method: "post",
          url: "/api/captcha",
          data: {
            token
          },
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        });
      }

      // if (response?.data?.success === true) {
      await axios.post("/api/sendEmail", {
        to: data.email,
        subject: "【インフルエンサーめぐり】お問い合わせを受け付けました",
        html: `
                <div>${data.name} 様
                  <br/>
                  <br/>お問い合わせいただき誠にありがとうございます。
                  <br/>下記の内容でお問い合わせを受け付けました。
                  <br/>
                  <br/>内容を確認の上、担当者よりご連絡させていただきます。
                  <br/>-----------------------------------------------------
                  <br/>お問い合わせ内容
                  <br/>
                  <br/>お名前          ：${data.name}
                  <br/>メールアドレス  ：${data.email}
                  <br/>お問い合わせ種別：${data.type ? data.type : ""}
                  <br/>お問い合わせ内容：${data.content ? data.content : ""}
                  <br/>-----------------------------------------------------
                </div>
                  `,
      });
      await axios.post("/api/sendEmail", {
        from: data.email,
        subject: "【インフルエンサーめぐり】お問い合わせがありました",
        html: `
                  <div>
                  インフルエンサーめぐりにお問い合わせがありました。
                  <br/>-----------------------------------------------------
                  <br/>お問い合わせ内容
                  <br/>
                  <br/>お名前          ：${data.name}
                  <br/>メールアドレス  ：${data.email}
                  <br/>お問い合わせ種別：${data.type ? data.type : ""}
                  <br/>お問い合わせ内容：${data.content ? data.content : ""}
                  <br/>-----------------------------------------------------
                  </div>
                  `,
      });
      setIsLoading(false);
      router.push('askConfirm');
      // } else {
      //   setError([`Captcha failed: ${response?.data?.score}`]);
      //   setIsLoading(false);
      // }
    }, [executeRecaptcha, data, agree, error]
  );
  return (
    <GoogleCaptchaWrapper>

      <div className="text-center">
        <div className="text-title mt-[200px] sp:mt-[150px]">お問い合わせ</div>
        <div className="flex mobile:flex-wrap py-[20px] w-[40%] sp:w-[90%] m-auto border-b-[1px] border-[#DDDDDD] sp:mt-[50px] mt-[90px]">
          <span className="w-[40%] mobile:w-full flex mobile:justify-start justify-end  mt-[7px] mr-[67px]">
            <span>お名前</span>
            <span className="ml-[10px] text-[#EE5736] text-[11px]">必須</span>
          </span>

          <Input
            placeholder="山田 太郎"
            handleChange={(val) => setData({ ...data, name: val })}
            inputClassName="max-w-[250px] mobile:max-w-full grow border-[#D3D3D3]"
          />
        </div>
        <div className="flex mobile:flex-wrap pt-[20px] w-[40%] sp:w-[90%] m-auto ">
          <span className="w-[40%] mobile:w-full flex mobile:justify-start justify-end mr-[67px]">
            <span>メールアドレス</span>
            <span className="ml-[10px] text-[#EE5736] text-[11px]">必須</span>
          </span>
          <div>
          </div>
          <Input
            placeholder="abcd@efgh.com"
            format="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            formatMsg="メールアドレス形式ではありません"
            handleChange={(val) => setData({ ...data, email: val })}
            inputClassName="max-w-[250px] mobile:max-w-full grow border-[#D3D3D3]"
          />
        </div>
        <div className="flex mobile:flex-wrap pb-[10px] w-[40%] sp:w-[90%] m-auto ">
          <div className="ml-[40%] mobile:ml-0 mobile:pl-0 pl-[67px] text-[12px] text-left grow border-[#D3D3D3]">※本システムをご利用の方は、登録しているEmailを入力してください。</div>
        </div>
        {/* <div className="flex w-[40%] pb-[5px] sp:w-[90%] m-auto ">
        <div className="w-[40%] flex invisible justify-end mr-[67px]">
        </div>
        <div className="max-w-[250px] mobile:max-w-full text-[12px] text-left">※本システムをご利用の方は、登録しているEmailを入力してください。</div>
      </div> */}

        <div className="flex mobile:flex-wrap py-[20px] w-[40%] sp:w-[90%] m-auto border-b-[1px] border-t-[1px] border-[#DDDDDD]">
          <span className="w-[40%] mobile:w-full flex mobile:justify-start justify-end mr-[67px]">
            <span>メールアドレス確認</span>
            <span className="ml-[10px] text-[#EE5736] text-[11px]">必須</span>
          </span>
          <Input
            placeholder="abcd@efgh.com"
            format="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            formatMsg="メールアドレス形式ではありません"
            handleChange={(val) => setData({ ...data, emailConfirm: val })}
            inputClassName="max-w-[250px] mobile:max-w-full grow border-[#D3D3D3]"
          />
        </div>
        {/* <div className="flex mobile:flex-wrap py-[20px] w-[40%] sp:w-[90%] m-auto border-b-[1px] border-[#DDDDDD]">
        <span className="w-[40%] mobile:w-full flex mobile:justify-start justify-end mr-[67px]">
          <span>お問い合わせ種別</span>
          <span className="ml-[10px] text-[#EE5736] text-[11px]">
            必須
          </span>
        </span>
        <Input
          handleChange={(val) => setData({ ...data, type: val })}
          inputClassName="max-w-[250px] mobile:max-w-full grow border border-[#D3D3D3] h-[33px]"
        ></Input>
      </div> */}
        <div className="flex mobile:flex-wrap py-[20px] w-[40%] sp:w-[90%] m-auto border-b-[1px] border-[#DDDDDD]">
          <span className="w-[40%] mobile:w-full flex mobile:justify-start justify-end mr-[67px]">
            <span>お問い合わせ種別</span>
            <span className="ml-[10px] text-[#EE5736] text-[11px]">
              必須
            </span>
          </span>
          <Select
            handleChange={(val) => setData({ ...data, type: val })}
            selectClassName="max-w-[250px] mobile:max-w-full  grow border-[#D3D3D3]"
          >
            <option value={""}></option>
            <option value={"サービスについて"}>サービスについて</option>
            <option value={"申し込みについて"}>申し込みについて</option>
            <option value={"利用中の不明点など"}>利用中の不明点など</option>
            <option value={"システムの不具合など"}>システムの不具合など</option>
            <option value={"その他"}>その他</option>
          </Select>
        </div>
        <div className="flex mobile:flex-wrap py-[20px] w-[40%] sp:w-[90%] m-auto border-b-[1px] border-[#DDDDDD]">
          <span className="w-[40%] mobile:w-full flex mobile:justify-start justify-end  mt-[7px] mr-[67px]">
            <span>お問い合わせ内容</span>
            <span className="ml-[10px] text-[#EE5736] text-[11px]">
              必須
            </span>
          </span>
          {/* <Input inputClassName="max-w-[250px] mobile:max-w-full grow border border-[#D3D3D3] h-[33px]"></Input> */}

          <TextArea
            handleChange={(val) => setData({ ...data, content: val })}
            textAreaClassName="max-w-[300px] mobile:max-w-full grow h-[95px]"
          />
        </div>

        {/* 管理部にメールを送信しました。 */}
        <div className="flex justify-center">
          <Checkbox
            prefix={""}
            handleChange={(val) => setAgree(val)}
            checkBoxClassName="mt-[36px]"
            title={
              <span>
                <Link href={'https://influencer-meguri.jp/privacypolicy.html'} target="_blank" className="underline decoration-[#353A40] underline-offset-[5px]">
                  個人情報の取り扱い
                </Link>
                に同意します
              </span>
            }
          />
        </div>
        <div className="text-center mt-[42px]">
          <Button buttonType={ButtonType.PRIMARY} handleClick={handleAsk}>
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
              確認画面へ
            </div>
          </Button>
          {error.length !== 0 &&
            error.map((aError, idx) => (
              <div className="text-center m-[10px] text-[#EE5736]" key={idx}>{aError}</div>
            ))
          }
        </div>
        <div className="mt-[154px] flex mobile:flex-wrap mb-[27px] flex justify-center gap-[20px] w-[full] m-auto text-[#AAAAAA]">
          <Link href={'https://influencer-meguri.jp/company-overview.html'} className="underline underline-offset-[5px]">
            会社概要
          </Link>
          <a href={'https://influencer-meguri.jp/company-overview.html#tokusyo'} className="underline underline-offset-[5px]">特定商取引法に基づく表記</a>
          <Link href={'https://influencer-meguri.jp/privacypolicy.html'} className="underline underline-offset-[5px]">プライバシーポリシー</Link>
          <Link href={'https://influencer-meguri.jp/terms-of-service.html'} className="underline underline-offset-[5px]">利用規約</Link>
          <Link href={'https://influencer-meguri.jp/company.html'} className="underline underline-offset-[5px]">運営会社</Link>
          <Link href={'https://influencer-meguri.jp/ask'} className="underline underline-offset-[5px]">お問い合わせ</Link>
        </div>
      </div>
    </GoogleCaptchaWrapper>
  );
}
