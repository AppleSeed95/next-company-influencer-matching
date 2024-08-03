import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../util/db";
export async function POST(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") || "";
  try {
    // const query = `SELECT cases.*, company.companyName
    // FROM cases
    // LEFT JOIN company ON cases.companyId=company.id
    // ORDER BY cases.id DESC`;
    const preQuery = `SELECT apply.*, company.companyName,company.id AS companyId,
    influencer.nickName, influencer.influencerName,cases.caseName
    FROM apply  
    LEFT JOIN influencer ON apply.influencerId = influencer.id  
    LEFT JOIN cases ON apply.caseId = cases.id  
    LEFT JOIN company ON cases.companyId = company.id  
    where apply.id = ${id}
    `;
    const rows = await executeQuery(preQuery).catch((e) => {
      throw new Error("something went wrong");
      return NextResponse.json({ type: "error", msg: "no table exists" });
    });

    const queryAfter = `select * from chatroom where applyId = ${id}`;
    const rowsAfter = await executeQuery(queryAfter).catch((e) => {
      throw new Error("something went wrong");
      return NextResponse.json({ type: "error", msg: "no table exists" });
    });
    if (rowsAfter.length > 0) {
      return NextResponse.json({
        type: "success",
        msg: "record already exists.",
      });
    }

    const influencerName =
      rows[0].influencerName?.length > 0 && rows[0].influencerName !== "null"
        ? rows[0].influencerName
        : rows[0].nickName;
    const influencerNickName = rows[0].nickName;
    const body = {
      applyId: rows[0].id,
      companyName: rows[0].companyName,
      companyId: rows[0].companyId,
      influencerId: rows[0].influencerId,
      influencerName: influencerName,
      influencerNickName: influencerNickName,
      caseName: rows[0].caseName,
    };
    const keys = Object.keys(body);
    let query1 = "";
    let query2 = "";
    keys?.map((aKey) => {
      query1 += aKey + ",";
      if (
        aKey === "applyId" ||
        aKey === "influencerId" ||
        aKey === "companyId"
      ) {
        query2 += " " + body[aKey] + " , ";
      } else {
        query2 += "'" + body[aKey] + "',";
      }
    });
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS chatroom (
        id INT AUTO_INCREMENT PRIMARY KEY,
        applyId int,
        companyId int,
        influencerId int,
        companyName VARCHAR(255),        
        influencerName VARCHAR(255),
        influencerNickName VARCHAR(255),
        caseName VARCHAR(255),
        FOREIGN KEY (applyId) REFERENCES apply(id)
      )
    `);
    const query = `INSERT INTO chatroom (${query1.slice(
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
    console.error("Error", error);
    return NextResponse.json({ type: "error", msg: "error" });
  }
}
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") || "";
  const type = request.nextUrl.searchParams.get("type") || "";
  try {
    const query = `SELECT chatroom.*,influencer.nickName , company.companyName as cName
    FROM chatroom
    LEFT JOIN influencer ON chatroom.influencerId = influencer.id
    LEFT JOIN company ON chatroom.companyId = company.id
     where ${type}Id = ${id} ORDER BY id DESC`;
    const rows = await executeQuery(query).catch((e) => {
      throw new Error("something went wrong");
      return NextResponse.json({ type: "error", msg: "no table exists" });
    });
    return NextResponse.json(rows);
  } catch (error) {
    throw new Error("something went wrong");
    console.error("Error fetching data:", error);
    return NextResponse.json({ type: "error", msg: "no table exists" });
  }
}
