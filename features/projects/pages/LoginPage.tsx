"use client";
import Button from "@/components/atoms/button";
import Input from "@/components/atoms/input";
import { ButtonType } from "@/components/atoms/buttonType";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { authUserState } from "@/recoil/atom/auth/authUserAtom";
import { login } from "@/features/auth/provider";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [_, setAuthUser] = useRecoilState(authUserState);
  useEffect(() => {
    document.title = 'ログイン';
  }, [])
  const handleLogin = async () => {
    if (password === "" && id === "") {
      setError("ID・PWを入力してください。");
      return;
    }
    if (id === "") {
      setError("IDを入力してください。");
      return;
    }
    if (password === "") {
      setError("パスワードを入力してください。");
      return;
    }
    setIsLoading(true);
    const { data: response, error } = await login({ email: id.trim(), password: password.trim() });
    setIsLoading(false);
    if (response.error || !response.type) {
      setError("サーバーでエラーが発生しました。");
      setIsLoading(false);
      return;
    }
    if (response.type === "error") {
      setIsLoading(false);
      setError(response.msg);
    } else {
      setIsLoading(false);
      setAuthUser({ user: response.data });
      if (typeof window !== "undefined") {
        switch (response.data?.role) {
          case "admin":
            router.push("/companyList");
            break;
          case "企業":
            router.push("/top");
            break;
          case "インフルエンサー":
            router.push("/influencerTop");

          default:
            break;
        }
      }
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };
  return (
    <div className="bg-[#F5F5F5] pt-[90px]  flex w-full grow">
      <div className="bg-[white] px-[20px] w-[614px] sp:w-[90%] rounded-[40px] block m-auto py-[70px] sp:py-[20px] shadow-lg">
        <img
          src="/img/logo(red).svg"
          className="blcok m-auto w-[265px] sp:hidden mb-[50px]"
        />
        <div className="flex justify-center w-full  mb-[20px] pr-[70px] sp:pr-[30px] sp:mt-[50px]">
          <span className="mr-[20px] mt-[5px] w-[70px] text-right">Email</span>
          <Input
            handleChange={(val) => setId(val)}
            inputClassName={"max-w-[250px] grow"}
            handleKeyPress={handleKeyPress}
          />
        </div>
        <div className="flex justify-center w-full  mb-[20px] pr-[70px] sp:pr-[30px] sp:mb-[30px]">
          <span className="mr-[20px] mt-[5px] w-[70px] text-right">
            パスワード
          </span>
          <Input
            password
            handleChange={(val) => setPassword(val)}
            handleKeyPress={handleKeyPress}
            inputClassName={"max-w-[250px] grow"}
          />
        </div>
        <div className="text-center mb-[10px]">
          <Button buttonType={ButtonType.PRIMARY} handleClick={handleLogin}>
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
              ログイン
            </div>
          </Button>
        </div>
        {error !== "" && (
          <div className="text-center text-[#EE5736]">{error}</div>
        )}
        <div className="flex justify-center">
          <span className="text-[#3F8DEB]">
            <Link href={"/resetPassword"}>パスワード変更はこちら</Link>
          </span>
          <img src="/img/triangle-right.svg" className="w-[11px] ml-[5px]" />
        </div>
      </div>
    </div>
  );
}
