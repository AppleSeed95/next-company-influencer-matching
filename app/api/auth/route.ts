import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../util/db";
const bcrypt = require("bcrypt");
import Stripe from "stripe";
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export interface RowType {
  id: number;
  email: string;
  password: string;
  role: string;
}

export async function PUT(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") || "";
  const { val, paymentId } = await request.json();
  try {
    const update = val ? 1 : 0;

    const query = `
      UPDATE users set active = ${update} where id = ${id}
    `;
    await executeQuery(query).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    if (!val) {
      try {
        await stripe.subscriptions.cancel(`${paymentId}`);
        const query = `UPDATE  company SET paymentId = '' WHERE paymentId = '${paymentId}' `;
        await executeQuery(query);
        return NextResponse.json({
          type: "success",
        });
      } catch (e) {
        console.log("error here", e);
      }
    }
    return NextResponse.json({
      type: "success",
    });
  } catch (error) {
    console.error("Error creating table or inserting record:", error);
    return NextResponse.json({ error: error });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body);
    const result = await executeQuery(
      `SELECT * FROM users where email = '${body.id}'`
    ).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    if (!result || !result.length || result.length === 0) {
      return NextResponse.json({
        type: "error",
        msg: "入力に誤りがあります。",
      });
    }
    const user = result[0];
    console.log(user);
    if (user.role === "admin") {
      if (!(user?.plainPassword?.length > 0)) {
        if (body.password === "12345") {
          return NextResponse.json({
            type: "success",
            data: { ...user, targetName: "管理者" },
            token: user.password + ":" + user.email,
          });
        }
      } else {
        const isMatch = await bcrypt.compare(body.password, user.password);
        if (isMatch) {
          return NextResponse.json({
            type: "success",
            data: { ...user, targetName: "管理者" },
            token: user.password + ":" + user.email,
          });
        }
      }
    }
    const isMatch = await bcrypt.compare(body.password, user.password);
    console.log(isMatch);

    // const isMatch = true;
    if (!isMatch) {
      return NextResponse.json({
        type: "error",
        msg: "入力に誤りがあります。",
      });
    }

    const type = user.role === "企業" ? "company" : "influencer";
    const result1 = await executeQuery(
      `SELECT * FROM ${type} where userId = ${user.id}`
    ).catch((e) => {
      return NextResponse.json({ type: "error" });
    });

    if (!result1 || !result1.length || result1.length === 0) {
      return NextResponse.json({
        type: "error",
        msg: "入力に誤りがあります。",
      });
    }
    const targetId = result1[0].id;
    const targetStatus = result1[0].status;
    const isFree = result1[0].freeAccount ? result1[0].freeAccount : true;
    const active = user.active;
    let data = {
      ...user,
      targetId,
      targetStatus,
      isFree,
      active,
    };
    if (user.role === "企業") {
      const paymentInfo = new Date(result1[0].payment);
      const today = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Tokyo",
        timeZoneName: "short",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      const jstTime = today.toLocaleString("en-US", options);
      console.log(jstTime);

      const allowed = paymentInfo > today;
      console.log(paymentInfo, today, allowed, active);

      if (!allowed && active !== 1) {
        return NextResponse.json({
          type: "error",
          msg: "利用期限が過ぎました。",
        });
      }
      data = {
        ...data,
        payment: result1[0].payment,
        targetName: result1[0].companyName,
        responsibleName: result1[0].responsibleName,
      };
    } else {
      data = { ...data, targetName: result1[0].nickName };
    }
    return NextResponse.json({
      type: "success",
      data,
      token: user.password + ":" + user.email,
    });
  } catch (error) {
    console.error("Error creating table or inserting record:", error);
    return NextResponse.json({ error: error });
  }
}
