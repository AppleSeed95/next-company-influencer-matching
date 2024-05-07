'use client'
import { useRecoilValue } from "recoil";
import { authUserState } from "@/recoil/atom/auth/authUserAtom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


import Header from "@/components/organisms/Header";
import InfluencerSidebar from "@/components/organisms/influencerSidebar";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authUser = useRecoilValue(authUserState);
  const router = useRouter();
  useEffect(() => {
    if (authUser.user.role === '企業') {
      router.push('/top');
    }
    if (authUser.user.role === 'admin') {
      router.push('/companyList');
    }
  }, [authUser])
  return (
    <div>
      <Header mode={"influencer"} />
      <div className="flex min-h-screen">
        <InfluencerSidebar />
        <div className="w-full bg-[white]">{children}</div>
      </div>
    </div>
  );
}
