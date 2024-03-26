import Header from "@/components/organisms/Header";
import CompanySideBar from "@/components/organisms/companySidebar";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
