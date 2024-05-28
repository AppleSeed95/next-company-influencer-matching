import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../util/db";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") || "";
  try {
    const queryForCompany = `SELECT * FROM company WHERE id = '${id}'`;
    const result = await executeQuery(queryForCompany).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    if (result.length === 0) {
      return NextResponse.json({
        type: "error",
        msg: "入力に誤りがあります。",
      });
    }
    const company = result[0];
    const possibleAutoCollectionCnt = Math.min(
      company.monthlyCollectionCnt - company.thisMonthCollectionCnt,
      company.concurrentCollectionCnt - company.conCurrentCnt
    );

    const countQuery = `
      SELECT COUNT(*) AS cnt
      FROM cases
      WHERE companyId = ${id}
      AND status = '承認'
      AND collectionStatus != '停止中'
      AND collectionStatus != '募集終了'
      AND collectionStatus != '完了'
      AND collectionStatus != '募集中'
      AND autoStart = 1
      AND collectionStart < NOW()
      AND collectionStart IS NOT NULL
      AND collectionStart <> '' 
      `;
    const count = await executeQuery(countQuery).catch((e) => {
      return NextResponse.json({ type: "error" });
    });

    const updateQuery = `
    UPDATE cases
      SET collectionStatus = '募集中'
      WHERE companyId = ${id}
      AND status = '承認'
      AND collectionStatus != '停止中'
      AND collectionStatus != '募集終了'
      AND collectionStatus != '完了'
      AND collectionStatus != '募集中'
      AND autoStart = 1
      AND collectionStart < NOW()
      AND collectionStart IS NOT NULL
      AND collectionStart <> '' 
      LIMIT ${company.freeAccount ? 1000 : possibleAutoCollectionCnt} ;    
      `;
    await executeQuery(updateQuery).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    const countQuery1 = `
    SELECT COUNT(*) AS cnt
    FROM cases
    WHERE companyId = ${id}
      AND collectionStatus = '募集中'
      AND collectionEnd < NOW()
      AND collectionEnd IS NOT NULL
      AND collectionEnd <> ''
    `;
    const count1 = await executeQuery(countQuery1).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    const updateQuery1 = `UPDATE cases
      SET collectionStatus = '募集終了'
      WHERE companyId = ${id}
      AND collectionStatus = '募集中'
      AND collectionEnd < NOW()
      AND collectionEnd IS NOT NULL
      AND collectionEnd <> ''
      `;

    await executeQuery(updateQuery1).catch((e) => {
      return NextResponse.json({ type: "error" });
    });

    const collectionEndedCasesQuery = `SELECT * from cases WHERE collectionStatus = '募集終了' and companyId = ${id}`;
    const collectionEndedCases = await executeQuery(collectionEndedCasesQuery);
    collectionEndedCases.forEach(async (element) => {
      const updateQuery2 = `UPDATE cases SET collectionStatus = '完了'
          WHERE id = ${element.id} and collectionStatus = '募集終了' and (SELECT COUNT(*) FROM apply WHERE caseId = ${element.id} and status = '承認') = 0
          and (SELECT COUNT(*) FROM apply WHERE caseId = ${element.id} and status = '申請中') != 0
          `;
      const test = await executeQuery(updateQuery2);
    });
    const autoStartedCnt = company.freeAccount
      ? count[0].cnt
      : Math.min(possibleAutoCollectionCnt, count[0].cnt);
    const autoEndedCnt = count1[0].cnt;
    let concurrentDiffuse = autoStartedCnt - autoEndedCnt;
    const updateCompanyQuery = `
    UPDATE company
    SET thisMonthCollectionCnt = thisMonthCollectionCnt + ${autoStartedCnt},
    conCurrentCnt = conCurrentCnt + ${concurrentDiffuse}
    WHERE id = ${id}
    `;

    await executeQuery(updateCompanyQuery).catch((e) => {
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
