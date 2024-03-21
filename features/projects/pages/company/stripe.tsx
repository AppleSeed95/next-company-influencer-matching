import { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51OV8DpHeC7VfJv8UJXLcBhECs81qBUSwD7ZJQmNuFtbien8WQCuZ2SCzkOYu2siAwkH1x4GqvCPUJqOVXQULsoz200ctmm80cL');

const CheckoutPage = () => {
    useEffect(() => {
        const handleClick = async () => {
            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({
                lineItems: [{ price: 'price_1OwZjoHeC7VfJv8UdI0dIqtl', quantity: 1 }],
                mode: 'subscription',
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
            <button id="checkoutButton">Checkout</button>
        </div>
    );
};

export default CheckoutPage;