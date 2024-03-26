"use client";
import CompanyPage from "@/features/projects/pages/admin/companyPage";
import React, { useEffect, useState } from "react";
import { useParams,useRouter } from "next/navigation";
import axios from "axios";
const Company: React.FC = () => {
  const [data, setData] = useState({});
  const [valid, setValid] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`/api/company/aCompany?id=${id}`);
      if(result.data.type === 'error'){
        if (typeof window !== "undefined") {
          setValid(false)
          router.push("/companyList");
        }
      }
      if (result.data) {
        setData(result.data)
        setValid(true);
      };
    };
    fetchData();
  }, [id]);
  return (
    <div>
      { valid && <CompanyPage companyData={data} />}
    </div>
  );
};
export default Company;
