import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { API_KEY } from "./config";

// sgMail.setApiKey(process.env.API_KEY as string);
sgMail.setApiKey(
  "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"
);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
console.log(ADMIN_EMAIL);

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

    const res = await sgMail.send(msg);
    if (!res) {
      return NextResponse.json({ type: "error" });
    }
    return NextResponse.json(res);
  } catch (error) {
    throw error;
  }
}
