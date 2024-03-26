'use client'
import AppliedListPage from "@/features/projects/pages/company/appliedList";
import { useRecoilValue } from "recoil";
import { authUserState } from "@/recoil/atom/auth/authUserAtom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";

function AppleidList() {
  const authUser = useRecoilValue(authUserState);
  const id = authUser?.user?.id;
  const router = useRouter();
  useEffect(() => {
    const fetchPaymentInfo = async () => {
      const { data } = await axios.get(`/api/company/aCompany/getPayment?id=${id}`)
      if (data) {
        const paymentInfo = new Date(data.data.payment);
        const today = new Date(data.todayString);
        const payed = paymentInfo > today;
        if (!payed) {
          router.push('/paymentRequire');
        }
      }
    }
    fetchPaymentInfo();
  }, [])

  return (
    <div className="h-full">
      <AppliedListPage />
    </div>
  );
}
export default AppleidList;
