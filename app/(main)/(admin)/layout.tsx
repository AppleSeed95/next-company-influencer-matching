'use client'
import { useRecoilValue } from "recoil";
import { authUserState } from "@/recoil/atom/auth/authUserAtom";
import { useRouter } from "next/navigation";
import Header from "@/components/organisms/Header";
import SideBar from "@/components/organisms/sidebar";
import { useEffect } from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authUser = useRecoilValue(authUserState);
  const router = useRouter();
  useEffect(() => {
    if (authUser.user.role === 'インフルエンサー') {
      router.push('/influencerTop');
    }
    if (authUser.user.role === '企業') {
      router.push('/top');
    }
  }, [authUser])
  return (
    <div>
      <div>
        <Header mode={"admin"} />
        <div className="flex min-h-screen">
          <SideBar />
          <div className="w-full bg-[white]">{children}</div>
        </div>
      </div>
    </div>
  );
}
