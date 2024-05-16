import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/footer";
import LoginPage from "@/features/projects/pages/LoginPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico',
  },
}
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header mode={"auth"} />
      <LoginPage />
      <Footer />
    </div>
  );
}
