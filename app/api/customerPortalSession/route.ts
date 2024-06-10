import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId } = body;
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${process.env.SITE_URL}/companyInfo`,
      });
      return NextResponse.json({ url: session.url });
    } catch (err) {
      return NextResponse.json({
        type: "error",
        msg: err.message,
      });
    }
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({
      type: "error",
      msg: "Webhook signature verification failed",
    });
  }
}
