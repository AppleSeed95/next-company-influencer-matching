import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../util/db";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.API_KEY);

import { ADMIN_EMAIL } from "../sendEmail/config";

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    switch (body.type) {
      case "checkout.session.completed":
        break;
      case "invoice.paid":
        const email = body.data.object.customer_email;
        const companyQuery = `SELECT responsibleName from company where emailAddress = '${email}'`;
        const company = await executeQuery(companyQuery).catch((e) => {
          return NextResponse.json({ type: "error" });
        });
        if (!(company.length > 0)) {
          return NextResponse.json({ type: "error" });
        }
        const customerCompany = company[0].responsibleName;
        const msg = {
          to: email,
          from: ADMIN_EMAIL,
          subject: "【インフルエンサーめぐり】決済完了のご連絡",
          html: `<div>${customerCompany} 様
          <br/>
          <br/>いつもインフルエンサーめぐりをご利用いただきありがとうございます。<br/>
          <br/>本日、ご登録のカードで請求処理をさせていただきました。
          <br/>明細は、ログイン後に「企業情報変更」の「決済情報変更」ボタンよりご確認いただけます。
          <br/>請求書、領収書も発行可能となっております。<br/>
          <br/>引き続き、インフルエンサーめぐりをよろしくお願いします。<br/>
          <br/>-----------------------------------------------------
          <br/>不明点がございましたらお問い合わせフォームよりご連絡ください。
          </div>https://influencer-meguri.jp/ask
          
          `,
        };

        const res = await sgMail.send(msg).catch((e) => {
          console.log(e.response.body.errors);
        });
        if (!res) {
          return NextResponse.json({ type: "error" });
        }

        const customerId = body.data.object.customer;
        const paymentId = body.data.object.subscription;
        const query = `SELECT payment, paymentCnt
                            FROM company
                            WHERE emailAddress = '${email}'
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
        console.log(currentDate, "updateString", updateString);

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
        const email_fail = body.data.object.customer_email;

        const companyQuery_fail = `SELECT responsibleName,companyName from company where emailAddress = '${email_fail}'`;
        const company_fail = await executeQuery(companyQuery_fail).catch(
          (e) => {
            return NextResponse.json({ type: "error" });
          }
        );
        if (!(company_fail.length > 0)) {
          return NextResponse.json({ type: "error" });
        }
        const customerCompany_fail = company_fail[0].responsibleName;
        const customerCompany_fail_name = company_fail[0].companyName;
        const msg_fail = {
          to: email_fail,
          from: ADMIN_EMAIL,
          subject: "【インフルエンサーめぐり】決済エラーのご連絡",
          html: `<div>${customerCompany_fail} 様
                  <br/>
                  <br/>いつもインフルエンサーめぐりをご利用いただきありがとうございます。<br/>
                  <br/>ご登録いただいたカードで決済ができませんでした。
                  <br/>ログイン後に「企業情報変更」の「決済情報変更」ボタンよりカード情報のご確認・変更をお願いします。
                  <br/>
                  <br/>-----------------------------------------------------
                  <br/>不明点がございましたらお問い合わせフォームよりご連絡ください。
                  </div>https://influencer-meguri.jp/ask

                  `,
        };

        const res_fail = await sgMail.send(msg_fail).catch((e) => {
          console.log(e.response.body.errors);
        });
        if (!res_fail) {
          return NextResponse.json({ type: "error" });
        }
        const msg_fail_admin = {
          from: ADMIN_EMAIL,
          to: ADMIN_EMAIL,
          subject: "【インフルエンサーめぐり】決済エラー",
          html: `<div>以下の企業で決済ができませんでした。<br/>
                 <br/>
                  ${customerCompany_fail_name}
                  `,
        };
        console.log(customerCompany_fail_name);

        await sgMail.send(msg_fail_admin).catch((e) => {
          console.log(e.response.body.errors);
        });
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
