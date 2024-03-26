import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../util/db";
const bcrypt = require("bcrypt");

export interface RowType {
  id: number;
  email: string;
  password: string;
  role: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
    const isMatch = await bcrypt.compare(body.password, user.password);
    // if (!isMatch) {
    //   return NextResponse.json({
    //     type: "error",
    //     msg: "入力に誤りがあります。",
    //   });
    // }
    if (user.role === "admin") {
      return NextResponse.json({ type: "success", data: user });
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
    let data = { ...user, targetId, targetStatus, isFree };
    if(user.role === "企業") {
      data = {...data, payment: result1[0].payment}
    }
    return NextResponse.json({
      type: "success",data
    });
  } catch (error) {
    console.error("Error creating table or inserting record:", error);
    return NextResponse.json({ error: error });
  }
}
