import Header from "@/components/organisms/Header";
import InfluencerSidebar from "@/components/organisms/influencerSidebar";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
