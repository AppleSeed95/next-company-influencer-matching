import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/app/api/util/db";
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") || "";
  try {
    const query = `SELECT company.payment FROM company left join users on company.userId = users.id where users.id = ${id} `;
    const rows = await executeQuery(query).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    if (!rows || !rows.length || rows.length === 0) {
      return NextResponse.json({
        type: "error",
        msg: "no result.",
      });
    }
    const today = new Date();
    const todayString = today.toISOString();
    return NextResponse.json({ data: rows[0], todayString });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ type: "error" });
  }
}
export async function POST() {
  return NextResponse.json({ type: "success" });
}
