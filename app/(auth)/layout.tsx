import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/footer";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header mode={"auth"} />
      {children}
      <Footer />
    </div>
  );
}
