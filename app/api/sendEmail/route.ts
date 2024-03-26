import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { API_KEY, ADMIN_EMAIL } from "./config";

sgMail.setApiKey(API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, content, from } = body;
    const msg = {
      to: to ? to : ADMIN_EMAIL,
      from: from ? from : ADMIN_EMAIL,
      subject,
      text: content,
    };
    console.log(msg);
    
    // const res = await sgMail.send(msg).catch((e) => {
    //   console.log(e);
    // });
    // if (!res) {
    //   return NextResponse.json({ type: "error" });
    // }
    // return NextResponse.json(res);
    return NextResponse.json({type:'success'});
  } catch (error) {
    throw error;
  }
}
