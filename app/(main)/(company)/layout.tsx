'use client'
import { useRecoilValue } from "recoil";
import { authUserState } from "@/recoil/atom/auth/authUserAtom";
import { useRouter } from "next/navigation";

import Header from "@/components/organisms/Header";
import CompanySideBar from "@/components/organisms/companySidebar";
import { useEffect } from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authUser = useRecoilValue(authUserState);
  const router = useRouter();
  useEffect(() => {
    if (authUser.user?.role === 'インフルエンサー') {
      router.push('/influencerTop');
    }
    if (authUser.user?.role === 'admin') {
      router.push('/companyList');
    }
  }, [authUser])

  return (
    <div>
      <Header mode={"company"} />
      <div className="flex min-h-screen">
        <CompanySideBar />
        <div className="w-full bg-[white]">{children}</div>
      </div>
    </div>
  );
}
