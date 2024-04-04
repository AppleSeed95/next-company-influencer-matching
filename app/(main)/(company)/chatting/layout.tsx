import ChattingRooms from "@/features/projects/pages/chatting/rooms";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[white] px-[35px] sp:px-[12px] sp:text-small flex flex-col h-full">
      <div className="flex items-center py-[20px]  w-[full] border-b-[1px] border-[#DDDDDD] h-[7vh] mt-[7vh] sp:mt-[96px]">
        <span className="text-title sp:text-sptitle">チャット</span>
      </div>
      <div className="h-full pt-[6vh]">
        <div className="sp:w-[100%] px-[40px] sp:px-[10px] pb-[7vh] flex h-full max-h-[80vh]">
          <div className="w-[30%] sp:w-[0] sp:hidden">
            <ChattingRooms />
          </div>
          <div className="h-full border-[1px] border-[#DDDDDD] w-[70%] box-border w-full flex flex-col">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
