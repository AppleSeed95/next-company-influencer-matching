import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../util/db";

export async function POST() {
  return NextResponse.json({ type: "success" });
}
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") || "";
  try {
    const updateQuery = `UPDATE cases
      SET collectionStatus = '募集中'  
      WHERE id = ${id}
      AND status = '承認'
      AND collectionStatus != '停止中'
      AND collectionStatus != '募集終了'
      AND collectionStart < NOW()
      AND collectionStart IS NOT NULL
      AND collectionStart <> ''
      `;
    await executeQuery(updateQuery).catch((e) => {
      return NextResponse.json({ type: "error" });
    });

    const updateQuery1 = `UPDATE cases
      SET collectionStatus = '募集終了'
      WHERE id = ${id}
      AND collectionStatus = '募集中'
      AND collectionEnd < NOW()
      AND collectionEnd IS NOT NULL
      AND collectionEnd <> ''
      `;

    await executeQuery(updateQuery1).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    const updateQuery2 = `UPDATE cases
      SET collectionStatus = '完了'
      WHERE id = ${id}
      AND caseEnd < NOW()
      AND caseEnd IS NOT NULL
      AND caseEnd <> ''
      `;

    await executeQuery(updateQuery2).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    const query = `SELECT apply.*,influencer.nickName, influencer.instagram,influencer.x,influencer.tiktok,influencer.youtube, influencer.facebook
      FROM apply
      LEFT JOIN influencer ON apply.influencerId = influencer.id
      WHERE apply.caseId = '${id}'
      ORDER BY apply.id DESC`;
    const rows = await executeQuery(query).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    const approved = rows.filter((a) => a.status !== "否決");
    const completed = rows.filter((a) => a.status === "完了");

    if (approved.length === completed.length) {
      const updateQuery1 = `UPDATE cases
      SET collectionStatus = '募集終了'  
      WHERE id = ${id}
      `;
      await executeQuery(updateQuery1).catch((e) => {
        return NextResponse.json({ type: "error" });
      });
    }
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ type: "error" });
  }
}
