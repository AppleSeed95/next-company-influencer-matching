import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../util/db";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") || "";
  try {
    const query = `SELECT chatroom.*,company.emailAddress as companyEmail,influencer.emailAddress as infEmail, company.representativeName,company.responsibleName
     FROM chatroom
     LEFT JOIN influencer ON chatroom.influencerId = influencer.id
     LEFT JOIN company ON chatroom.companyId = company.id
     where chatroom.applyId = ${id}
     `;

    const rows = await executeQuery(query).catch((e) => {
      return NextResponse.json({ type: "error", msg: "no table exists" });
    });
    if (!rows.length) {
      return NextResponse.json({ type: "error", msg: "no table exists" });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ type: "error", msg: "no table exists" });
  }
}
export async function POST() {
  return NextResponse.json({ type: "success" });
}
