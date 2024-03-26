import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/footer";
import LoginPage from "@/features/projects/pages/LoginPage";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header mode={"auth"} />
      <LoginPage />
      <Footer />
    </div>
  );
}
