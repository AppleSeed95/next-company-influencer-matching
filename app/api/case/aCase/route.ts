import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../util/db";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") || "";
  try {
    const query = `SELECT cases.*, company.companyName, company.emailAddress, company.representativeName
      FROM cases
      LEFT JOIN company ON cases.companyId=company.id 
      where cases.id = ${id}
      ORDER BY cases.id DESC
      `;
    const rows = await executeQuery(query).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    const companyId = rows[0].companyId;

    const query1 = `SELECT id FROM cases WHERE companyId = ${companyId}`;
    const rows1 = await executeQuery(query1).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    return NextResponse.json({ data: rows[0], companyCases: rows1 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ type: "error" });
  }
}
export async function PUT(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") || "";
  try {
    const { update, reason, approveMode, resumeMode, companyId } =
      await request.json();
    const preQuery = `SELECT * FROM company where id=${companyId}`;
    const rows = await executeQuery(preQuery).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    const companyStatus = rows[0].status;
    if (companyStatus !== "稼働中" && companyStatus !== "稼動中") {
      return NextResponse.json({
        type: "error",
        msg: "承認されていないため、募集をうまくできません。",
      });
    }
    const query = approveMode
      ? `UPDATE cases
    SET status = '${update}',reason = '${reason}'
    WHERE id = ${id}`
      : `UPDATE cases
    SET collectionStatus = '${update}'
    WHERE id = ${id}`;
    if (update === "停止中") {
      const queryWhenPause = `UPDATE cases SET collectionStatus = '${update}',edited = FALSE
      WHERE id = ${id}`;
      const result = await executeQuery(queryWhenPause);
      if (result) return NextResponse.json({ type: "success" });
      else return NextResponse.json({ type: "error" });
    }
    if (update === "募集終了") {
      const queryWhenQuit = `UPDATE company SET conCurrentCnt = conCurrentCnt - 1
      WHERE id = ${companyId}`;
      const result = await executeQuery(queryWhenQuit);
      if (result) {
        const result1 = await executeQuery(query);
        if (result1) return NextResponse.json({ type: "success" });
        else return NextResponse.json({ type: "error" });
      }
    }
    if (!approveMode && !resumeMode) {
      const queryForCompany = `SELECT * FROM company WHERE id = '${companyId}'`;
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
      if (!company.freeAccount) {
        if (company.conCurrentCnt === company.concurrentCollectionCnt) {
          return NextResponse.json({
            type: "fail",
            msg: "同時募集限界なので募集を開始できません。",
          });
        }
        if (company.thisMonthCollectionCnt === company.monthlyCollectionCnt) {
          return NextResponse.json({
            type: "fail",
            msg: "月募集限界なので募集を開始できません。",
          });
        }
      }
      const queryForCompany1 = `UPDATE company SET thisMonthCollectionCnt = ${
        company.thisMonthCollectionCnt + 1
      }
       , 
      conCurrentCnt = ${company.conCurrentCnt + 1}
      where id = ${companyId}
      `;
      await executeQuery(queryForCompany1);
      const result1 = await executeQuery(query);
      if (result1) return NextResponse.json({ type: "success" });
      else return NextResponse.json({ type: "error" });
    }

    const result = await executeQuery(query);
    if (result) return NextResponse.json({ type: "success" });
    else return NextResponse.json({ type: "error" });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
