import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../util/db";

export async function POST(request: NextRequest) {
  try {
    let body = await request.json();
    const influencerId = body.influencerId;
    const caseId = body.caseId;
    const preQuery = `SELECT * FROM influencer where id=${influencerId}`;
    const rows = await executeQuery(preQuery).catch((e) => {
      throw new Error("something went wrong");
      return NextResponse.json({ type: "error" });
    });
    const influencerStatus = rows[0].status;

    if (influencerStatus !== "稼働中" && influencerStatus !== "稼動中") {
      return NextResponse.json({ type: "error", msg: "応募できません" });
    }
    const preQuery1 = `SELECT company.* FROM company
    LEFT JOIN cases on cases.companyId = company.id
     where cases.id=${caseId}`;
    const rows1 = await executeQuery(preQuery1).catch((e) => {
      throw new Error("something went wrong");
      return NextResponse.json({ type: "error" });
    });
    const companyStatus = rows1[0].status;

    if (companyStatus !== "稼働中" && companyStatus !== "稼動中") {
      return NextResponse.json({
        type: "error",
        msg: "募集が停止されたため、応募できません",
      });
    }

    const preQuery2 = `SELECT * FROM cases
    where id=${caseId}`;
    const rows2 = await executeQuery(preQuery2).catch((e) => {
      throw new Error("something went wrong");
      return NextResponse.json({ type: "error" });
    });
    const caseStatus = rows2[0].collectionStatus;

    if (caseStatus === "停止中") {
      return NextResponse.json({
        type: "error",
        msg: "募集が停止されたため、応募できません",
      });
    }
    if (caseStatus === "募集終了") {
      return NextResponse.json({
        type: "error",
        msg: "募集が終了したため、応募できません",
      });
    }
    const today = new Date();
    const todayString = `${today.getFullYear()}/${
      today.getMonth() + 1
    }/${today.getDate()}`;
    const defaultValues = {
      status: "申請中",
      date: todayString,
    };
    body = { ...body, ...defaultValues };
    let query1 = "";
    let query2 = "";
    const keys = Object.keys(body);
    keys?.map((aKey) => {
      query1 += aKey + ",";
      query2 += "'" + body[aKey] + "',";
    });
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS apply (
        id INT AUTO_INCREMENT PRIMARY KEY,
        caseId int,
        influencerId int,        
        date VARCHAR(255),
        status VARCHAR(255), 
        FOREIGN KEY (caseId) REFERENCES cases(id),
        FOREIGN KEY (influencerId) REFERENCES influencer(id)
      )
    `);
    console.log("Table created successfully!");
    const query = `INSERT INTO apply (${query1.slice(
      0,
      -1
    )}) VALUES(${query2.slice(0, -1)})`;

    await executeQuery(query).catch((e) => {
      throw new Error("something went wrong");
      return NextResponse.json({ type: "error", msg: "error" });
    });
    return NextResponse.json({ type: "success" });
  } catch (error) {
    throw new Error("something went wrong");
    console.error("Error creating table or inserting record:", error);
    return NextResponse.json({ type: "error", msg: "error" });
  }
}
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") || "";
  try {
    //   LEFT JOIN cases ON apply.companyId = company.id
    // `SELECT apply.*, cases.*
    // FROM apply
    // LEFT JOIN apply ON apply.caseId = cases.id
    // ORDER BY apply.id DESC`
    const query = `SELECT apply.*, cases.caseType,cases.caseName,cases.caseContent,cases.wantedHashTag,
      cases.wantedSNS, cases.casePlace, cases.collectionStart, cases.collectionEnd, cases.addition, cases.collectionStatus,
      cases.reason,
      cases.caseEnd,
      company.companyName
      FROM apply
      LEFT JOIN cases ON apply.caseId = cases.id
      LEFT JOIN company ON cases.companyId = company.id
      WHERE apply.influencerId = ${id}
      ORDER BY apply.id DESC
      `;

    const rows = await executeQuery(query).catch((e) => {
      throw new Error("something went wrong");
      return NextResponse.json({ type: "error" });
    });

    return NextResponse.json(rows);
  } catch (error) {
    throw new Error("something went wrong");
    console.error("Error fetching data:", error);
    return NextResponse.json({ type: "error" });
  }
}
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    let query = "UPDATE apply SET ";
    const keys = Object.keys(body);

    keys?.map((aKey) => {
      if (aKey !== "id") {
        query += `${aKey} = '${body[aKey]}', `;
      }
    });
    query = query.slice(0, -2);
    query += " ";
    query += `WHERE id = ${body.id}`;

    const result = await executeQuery(query).catch((e) => {
      throw new Error("something went wrong");
      return NextResponse.json({ type: "error" });
    });
    let query1 = `SELECT apply.*,cases.caseName,influencer.influencerName,influencer.nickName,company.representativeName,company.responsibleName,company.emailAddress
    FROM apply
    LEFT JOIN cases ON apply.caseId = cases.id
    LEFT JOIN company ON cases.companyId = company.id
    LEFT JOIN influencer ON apply.influencerId = influencer.id
    WHERE apply.id = ${body.id}
    `;
    const rows = await executeQuery(query1).catch((e) => {
      throw new Error("something went wrong");
      return NextResponse.json({ type: "error" });
    });
    if (rows.length) {
      return NextResponse.json({ type: "success", data: rows[0] });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data:");
    return NextResponse.json({ type: "error" });
  }
}
