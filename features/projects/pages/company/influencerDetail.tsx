import React from "react";
import Button from "@/components/atoms/button";
import { ButtonType } from "@/components/atoms/buttonType";
import Link from "next/link";

export interface InfluencerProps {
  influencerData?: object;
}

const InfluencerDetailPage: React.FC<InfluencerProps> = ({
  influencerData,
}: InfluencerProps) => {
  return (
    <div className="text-center bg-[white] px-[35px] sp:px-[12px] sp:text-small ">
      <div className="flex items-center py-[20px]  w-[full] border-b-[1px] border-[#DDDDDD] mt-[70px] sp:mt-[96px]">
        <span className="text-title sp:text-sptitle">ユニティー</span>
      </div>
      <div className="flex items-center py-[20px] w-[50%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD] mt-[90px] sp:mt-[30px]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">ユニティー</span>
        </span>
        <span>ユニティ</span>
      </div>
      <div className="flex items-center py-[15px] w-[50%]  sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">ジャンル</span>
        </span>
        <span>美容・コスメ系,アパレル・ファッション系</span>
      </div>
      <div className="flex items-center py-[15px] w-[50%]  sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#3F8DEB] underline underline-[#3F8DEB] underline-offset-[3px]">
            Instagram
          </span>
        </span>
        <span>フォロワー数：1,001～3,000</span>
      </div>
      <div className="flex items-center py-[15px] w-[50%]  sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#3F8DEB] underline underline-[#3F8DEB] underline-offset-[3px]">
            X
          </span>
        </span>
        <span>フォロワー数：1,001～3,000</span>
      </div>
      <div className="flex items-center py-[15px] w-[50%]  sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#3F8DEB] underline underline-[#3F8DEB] underline-offset-[3px]">
            facebook
          </span>
        </span>
        <span>フォロワー数：1,001～3,000</span>
      </div>
      <div className="flex items-center py-[15px] w-[50%]  sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#3F8DEB] underline underline-[#3F8DEB] underline-offset-[3px]">
            tiktok
          </span>
        </span>
        <span>フォロワー数：1,001～3,000</span>
      </div>
      <div className="flex items-center py-[15px] w-[50%]  sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#3F8DEB] underline underline-[#3F8DEB] underline-offset-[3px]">
            YouTube
          </span>
        </span>
        <span>フォロワー数：1,001～3,000</span>
      </div>
      <div className="flex py-[20px] w-[50%] sp:w-full m-auto border-b-[1px] border-[#DDDDDD]   sp:px-[18px]">
        <span className="w-[35%] sp:w-[100px] flex justify-end sp:justify-start  mr-[67px]">
          <span className="text-[#6F6F6F]">その他</span>
        </span>
        <div className="text-left">
          <div>LINE公式アカウントのお友達1000人</div>
          <div>スナップチャットフォロワー1000人</div>
        </div>
      </div>
      <div className="flex justify-center mt-[36px] mb-[160px] sp:mb-[60px]">
        <Button buttonType={ButtonType.PRIMARY} buttonClassName="mr-[30px]">
          <span className="flex items-center">
            <span>承認</span>
            <img
              className="w-[14px] ml-[5px]"
              src="/img/approve.svg"
              alt="approve"
            />
          </span>
        </Button>
        <Button buttonType={ButtonType.DANGER} buttonClassName="mr-[30px]">
          <span className="flex items-center">
            <span>否認</span>
            <img
              className="w-[14px] ml-[5px]"
              src="/img/cross.svg"
              alt="cross"
            />
          </span>
        </Button>
        <Button buttonType={ButtonType.OUTLINED}>
          <Link href={"/chatting"}>
            <span className="flex items-center">
              <span>チャ ット</span>
              <img
                className="w-[14px] ml-[5px]"
                src="/img/chatting.svg"
                alt="chatting"
              />
            </span>
          </Link>
        </Button>
      </div>
    </div>
  );
};
export default InfluencerDetailPage;
