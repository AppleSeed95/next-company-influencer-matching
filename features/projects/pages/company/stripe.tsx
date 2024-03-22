import { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51OV8DpHeC7VfJv8UJXLcBhECs81qBUSwD7ZJQmNuFtbien8WQCuZ2SCzkOYu2siAwkH1x4GqvCPUJqOVXQULsoz200ctmm80cL');

const CheckoutPage = () => {
    useEffect(() => {
        const handleClick = async () => {
            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({
                lineItems: [{ price: 'price_1Ox1PQHeC7VfJv8UA2wSiBeX', quantity: 1 }],
                mode: 'payment',
                successUrl: `${window.location.origin}/companyInfo`,
                cancelUrl: `${window.location.origin}/companyInfo`,
            });
            if (error) {
                console.error('Error:', error);
            }
        };

        document.querySelector('#checkoutButton').addEventListener('click', handleClick);
    }, []);

    return (
        <div>
            <div>
                お支払いページに移行しますか？
            </div>
            <button id="checkoutButton" className='m-[20px] px-[20px] py-[10px] rounded-[5px] text-[white] bg-[#3F8DEB] hover:bg-[#2e6fbe] hover:shadow-lg duration-500 '>確認</button>
        </div>
    );
};

export default CheckoutPage;