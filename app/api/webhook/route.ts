import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../util/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    console.log("type", body.type);

    switch (body.type) {
      case "checkout.session.completed":
        break;
      case "invoice.paid":
        console.log(body.data.object);

        const email = body.data.object.customer_email;
        const customerId = body.data.object.customer;
        const paymentId = body.data.object.subscription;
        const query = `SELECT company.payment, company.paymentCnt
                            FROM company
                            LEFT JOIN users ON company.emailAddress = users.email
                            WHERE company.emailAddress = '${email}'
                         `;
        const rows = await executeQuery(query).catch((e) => {
          return NextResponse.json({ type: "error" });
        });
        if (!rows || !rows.length || rows.length === 0) {
          return NextResponse.json({
            type: "error",
            msg: "no result.",
          });
        }
        const query2 = `SELECT plan.monthCnt, plan.concurrentCnt from plan
                      LEFT JOIN company ON company.plan = plan.id
                      WHERE company.emailAddress = '${email}'
                      `;
        const rows2 = await executeQuery(query2).catch((e) => {
          return NextResponse.json({ type: "error" });
        });
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 30);
        const dateString = currentDate.toISOString();
        let updateString;
        console.log(rows[0].payment);

        if (
          rows[0].payment === "" ||
          rows[0].payment === "null" ||
          rows[0].payment === null
        ) {
          updateString = dateString;
        } else {
          const lastPaymentInfo = new Date(rows[0].payment);
          lastPaymentInfo.setDate(lastPaymentInfo.getDate() + 30);
          updateString = lastPaymentInfo.toISOString();
        }
        console.log(updateString);

        let paymentCnt = rows[0].paymentCnt;
        if (!(paymentCnt > 0)) {
          paymentCnt = 0;
        }
        paymentCnt++;
        const query1 = `update company set payment = '${updateString}',paymentId = '${paymentId}', paymentCnt = ${paymentCnt} ,
                      customerId = '${customerId}',
                      monthlyCollectionCnt = ${rows2[0].monthCnt},
                      concurrentCollectionCnt = ${rows2[0].concurrentCnt},
                      thisMonthCollectionCnt = 0 where emailAddress = '${email}'`;

        await executeQuery(query1).catch((e) => {
          return NextResponse.json({ type: "error" });
        });
        break;
      case "invoice.payment_failed":
        break;
      default:
        console.log(`Unhandled event type`);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({
      type: "error",
      msg: "Webhook signature verification failed",
    });
  }
}
