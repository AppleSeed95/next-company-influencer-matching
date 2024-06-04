import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../util/db";
// import { Stripe } from 'stripe';
// import { buffer } from 'micro';

// const stripe = new Stripe('pk_test_51OV8DpHeC7VfJv8UJXLcBhECs81qBUSwD7ZJQmNuFtbien8WQCuZ2SCzkOYu2siAwkH1x4GqvCPUJqOVXQULsoz200ctmm80cL');

// const stripeWebhookSecret = 'we_1OwfQoHeC7VfJv8U3lv6WL7D';

export async function POST(request: NextRequest) {
  // Verify the signature of the webhook event
  // const buf = await buffer(request)
  // const signature = request.headers.get('stripe-signature');
  const body = await request.json();
  try {
    console.log(body.type);

    switch (body.type) {
      case "checkout.session.completed":
        // Handle checkout session completion, provide access
        break;
      case "invoice.paid":
        // Continue to provision the subscription as payments keep coming in
        break;
      case "invoice.payment_failed":
        // The payment failed or the subscription has a problem, alert the user, or revoke access
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    // Verify the signature using the Stripe webhook secret
    // const event = stripe.webhooks.constructEvent(buf.toString(), signature, stripeWebhookSecret);
    // if (body.type === "payment_intent.succeeded") {
    //   const email = body.data.object.receipt_email;
    //   const paymentId = body.data.object.payment_method;
    //   const query = `SELECT company.payment, company.paymentCnt
    //                         FROM company
    //                         LEFT JOIN users ON company.emailAddress = users.email
    //                         WHERE company.emailAddress = '${email}'
    //                      `;
    //   const rows = await executeQuery(query).catch((e) => {
    //     return NextResponse.json({ type: "error" });
    //   });
    //   if (!rows || !rows.length || rows.length === 0) {
    //     return NextResponse.json({
    //       type: "error",
    //       msg: "no result.",
    //     });
    //   }
    //   const query2 = `SELECT plan.monthCnt, plan.concurrentCnt from plan
    //                   LEFT JOIN company ON company.plan = plan.id
    //                   WHERE company.emailAddress = '${email}'
    //                   `;
    //   const rows2 = await executeQuery(query2).catch((e) => {
    //     return NextResponse.json({ type: "error" });
    //   });
    //   const currentDate = new Date();
    //   currentDate.setDate(currentDate.getDate() + 30);
    //   const dateString = currentDate.toISOString();
    //   let updateString;
    //   if (rows[0].payment === "" || rows[0].payment === "null") {
    //     updateString = dateString;
    //   } else {
    //     const lastPaymentInfo = new Date(rows[0].payment);
    //     lastPaymentInfo.setDate(lastPaymentInfo.getDate() + 30);
    //     updateString = lastPaymentInfo.toISOString();
    //   }
    //   let paymentCnt = rows[0].paymentCnt;
    //   if (!(paymentCnt > 0)) {
    //     paymentCnt = 0;
    //   }
    //   paymentCnt++;
    //   const query1 = `update company set payment = '${updateString}',paymentId = '${paymentId}', paymentCnt = ${paymentCnt} ,
    //                   monthlyCollectionCnt = ${rows2[0].monthCnt},
    //                   concurrentCollectionCnt = ${rows2[0].concurrentCnt},
    //                   thisMonthCollectionCnt = 0 where emailAddress = '${email}'`;

    //   await executeQuery(query1).catch((e) => {
    //     return NextResponse.json({ type: "error" });
    //   });
    //   return NextResponse.json({
    //     type: "success",
    //     updated: email,
    //     result: updateString,
    //   });
    // }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({
      type: "error",
      msg: "Webhook signature verification failed",
    });
  }
}
