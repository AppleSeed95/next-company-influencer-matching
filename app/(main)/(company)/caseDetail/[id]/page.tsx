"use client";
import { redirect, useParams } from "next/navigation";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { Redirect } from "next";
import CaseDetailPage from "@/features/projects/pages/company/caseDetail";
import { useRecoilValue } from "recoil";
import { authUserState } from "@/recoil/atom/auth/authUserAtom";

const CaseDetail: React.FC = () => {
  const [data, setData] = useState({});
  const [valid, setValid] = useState(false);
  const user = useRecoilValue(authUserState);
  const { id } = useParams();
  const router = useRouter();
  if (!user?.user && router) {
    router.push("/logout");
  }
  useEffect(() => {
    const fetchData = async () => {

      const result = await axios.get(`/api/case/aCase?id=${id}&&companyId=${user.user.targetId}`);
      if (result.data.type === 'error') {
        setValid(false);
        if (typeof window !== "undefined" && router) {
          router.push("/login");
        }
      }
      else {
        if (!(result.data.companyCases.some((a) => a.id == id)) && router) {
          router.push("/login");
        } else {
          setData(result.data.data);
          setValid(true);
        }
      }
    };
    if (id && user?.user) {
      fetchData();
    }
  }, [id, router, user]);
  return (
    <div className="h-full">
      {valid && <CaseDetailPage caseProps={data} />}
    </div>
  );
};
export default CaseDetail;
