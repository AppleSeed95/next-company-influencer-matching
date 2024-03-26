"use client";
import InfluencerPage from "@/features/projects/pages/admin/influencerPage";
import React, { useEffect, useState } from "react";
import { useParams,useRouter } from "next/navigation";
import axios from "axios";
const Influencer: React.FC = () => {
  const [data, setData] = useState({});
  const [valid, setValid] = useState(false)
  const router = useRouter();
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`/api/influencer/aInfluencer?id=${id}`);
      if(result.data.type === 'error'){
        if (typeof window !== "undefined") {
          setValid(false)
          router.push("/influencerList");
        }
      }else{
        setData(result.data);
        setValid(true);
      }
    };
    fetchData();
  }, [id]);
  return (
    <div>
      {valid && <InfluencerPage influencerData={data} />}
    </div>
  );
};
export default Influencer;
