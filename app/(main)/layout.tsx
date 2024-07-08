"use client";
import { useRecoilValue, useRecoilState } from "recoil";
import { authUserState } from "@/recoil/atom/auth/authUserAtom";

import { useRouter } from "next/navigation";
import axios from "axios";
import { useState, useEffect } from "react";

const Auth = ({ children }: { children: React.ReactNode }) => {

  const authUser = useRecoilValue(authUserState);
  const router = useRouter();

  const [_, setAuthUser] = useRecoilState(authUserState);

  const [authChecked, setAuthChecked] = useState(false);
  useEffect(() => {
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

    if (!parsedUser || parsedUser === undefined) {

      if (typeof window !== "undefined") {
        setAuthChecked(true);
        router.push("/login");
      }

    }
    if (savedUser && !authUser.user) {
      if (savedUser) {
        setAuthUser({ user: parsedUser });
      }
    }
  }, [])


  return authChecked ? children : null;
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Auth> {children}</Auth>;
}
