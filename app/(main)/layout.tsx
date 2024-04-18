"use client";
import { useRecoilValue, useRecoilState } from "recoil";
import { authUserState } from "@/recoil/atom/auth/authUserAtom";
import { useRouter } from "next/navigation";
import axios from "axios";

const Auth = ({ children }: { children: React.ReactNode }) => {
  const authUser = useRecoilValue(authUserState);
  const router = useRouter();
  const [_, setAuthUser] = useRecoilState(authUserState);
  let savedUser = null;
  if (typeof window !== "undefined") {
    savedUser = localStorage.getItem("user");
    const token = localStorage.getItem('token');
    axios.defaults.headers.common["Authorization"] = token;
  }
  let parsedUser;
  if (savedUser) {
    try {
      parsedUser = JSON.parse(savedUser);
    } catch (e) {
      parsedUser = null;
    }
  }
  if (!parsedUser) {
    if (typeof window !== "undefined") {
      router.push("/logout");
    }
  }
  if (savedUser && !authUser.user) {
    if (savedUser) {
      setAuthUser({ user: parsedUser });
    }
  }
  return children;
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Auth>{children}</Auth>;
}
