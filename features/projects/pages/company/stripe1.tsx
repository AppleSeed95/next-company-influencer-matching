import { useEffect, useState } from 'react';
import { authUserState } from "@/recoil/atom/auth/authUserAtom";
import { useRecoilValue } from 'recoil';
import { loadStripe } from '@stripe/stripe-js';
import { log } from 'console';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51OV8DpHeC7VfJv8UJXLcBhECs81qBUSwD7ZJQmNuFtbien8WQCuZ2SCzkOYu2siAwkH1x4GqvCPUJqOVXQULsoz200ctmm80cL');

interface priceProps {
    priceID: string;
    paymentCnt: number;
}

const CheckoutPage = ({ priceID, paymentCnt }: priceProps) => {
    const { user } = useRecoilValue(authUserState);
    const [isLoading, setIsLoading] = useState(false);
    const handleClick = async () => {
        setIsLoading(true);
        // const { data: { customer: { id: customerId } } } = await axios.post('/api/company/stripe/customer', { email: user?.email, name: user?.targetName });
        // const { data } = await axios.post('/api/company/stripe/subscription', { customerId });
        // console.log(data);
        const { data } = await axios.post('/api/company/stripe/customer', { email: user?.email, name: user?.targetName });

        setIsLoading(false);

    }
    return (
        <div className='pb-[5px]'>
            <div>
                お支払いページに移行しますか？
            </div>
            <button id="checkoutButton" onClick={handleClick} className='flex items-center m-auto my-[20px] px-[20px] py-[10px] rounded-[5px] text-[white] bg-[#3F8DEB] hover:bg-[#2e6fbe] hover:shadow-lg duration-500 '>
                <img
                    src="/img/refresh.svg"
                    alt="rotate"
                    className={isLoading ? "mr-[5px] rotate" : "mr-[5px] hidden"}
                />
                確認</button>
        </div>
    );
};

export default CheckoutPage;