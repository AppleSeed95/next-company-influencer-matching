"use client";
import { useParams } from "next/navigation";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CaseDetailPage from "@/features/projects/pages/company/caseDetail";

const CaseDetail: React.FC = () => {
  const [data, setData] = useState({});
  const [valid, setValid] = useState(false);
  const { id } = useParams();
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`/api/case/aCase?id=${id}`);
      if(result.data.type === 'error'){  
        setValid(false);      
        if (typeof window !== "undefined") {
          router.push("/appliedList");
        }
      }
      else {
        setData(result.data);
        setValid(true);
    }
    };
    fetchData();
  }, [id]);
  return (
    <div className="h-full">
      {valid && <CaseDetailPage caseProps={data} />}
    </div>
  );
};
export default CaseDetail;
