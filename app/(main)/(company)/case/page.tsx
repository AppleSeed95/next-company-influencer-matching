'use client'
import CasePage from "@/features/projects/pages/company/case";
import { useRecoilValue } from "recoil";
import { authUserState } from "@/recoil/atom/auth/authUserAtom";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


function Case() {
  const authUser = useRecoilValue(authUserState);
  const id = authUser?.user?.id;
  const router = useRouter();
  useEffect(() => {
    const fetchPaymentInfo = async () => {
      const { data } = await axios.get(`/api/company/aCompany/getPayment?id=${id}`)
      if (data && (data.data.freeAccount === 0 || data.data.freeAccount === false)) {
        const paymentInfo = new Date(data.data?.payment);
        const today = new Date(data.todayString);
        const payed = paymentInfo > today;
        if (!payed) {
          // router.push('/paymentRequire');
        }
      }
    }
    fetchPaymentInfo();
  }, [])

  return (
    <div >
      <CasePage />
    </div>
  );
}
export default Case;

