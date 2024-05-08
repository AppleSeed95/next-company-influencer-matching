import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../util/db";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") || "";
  try {
    const updateQuery = `UPDATE cases
      SET collectionStatus = '募集中'  
      WHERE companyId = ${id}
      AND status = '承認'
      AND collectionStatus != '停止中'
      AND collectionStatus != '募集終了'
      AND TIME(collectionStart) < TIME(CURTIME())
      AND collectionStart IS NOT NULL
      AND collectionStart <> ''
      `;
    await executeQuery(updateQuery).catch((e) => {
      return NextResponse.json({ type: "error" });
    });

    const updateQuery1 = `UPDATE cases
      SET collectionStatus = '募集終了'
      WHERE companyId = ${id}
      AND collectionStatus = '募集中'
      AND TIME(collectionEnd) < TIME(CURTIME())
      AND collectionEnd IS NOT NULL
      AND collectionEnd <> ''
      `;

    await executeQuery(updateQuery1).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    const updateQuery2 = `UPDATE cases
      SET collectionStatus = '完了'
      WHERE companyId = ${id}
      AND TIME(caseEnd) < TIME(CURTIME())
      AND caseEnd IS NOT NULL
      AND caseEnd <> ''
      `;

    await executeQuery(updateQuery2).catch((e) => {
      return NextResponse.json({ type: "error" });
    });

    const query = `SELECT * FROM cases where companyId = ${id} ORDER BY id DESC`;
    const rows = await executeQuery(query).catch((e) => {
      return NextResponse.json({ type: "error" });
    });

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ type: "error" });
  }
}
export async function POST() {
  return NextResponse.json({ type: "success" });
}
