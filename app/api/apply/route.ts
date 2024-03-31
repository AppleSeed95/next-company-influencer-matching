import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../util/db";

export async function POST(request: NextRequest) {
  try {
    let body = await request.json();

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
    // insertQuery += `'${body["ds"]}'`;
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
      return NextResponse.json({ type: "error", msg: "error" });
    });
    return NextResponse.json({ type: "success" });
  } catch (error) {
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
    const query = `SELECT apply.*, cases.caseName,cases.caseType,cases.casePlace ,company.companyName
      FROM apply
      LEFT JOIN cases ON apply.caseId = cases.id
      LEFT JOIN company ON cases.companyId = company.id
      WHERE apply.influencerId = ${id}
      ORDER BY apply.id DESC
      `;

    const rows = await executeQuery(query).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    return NextResponse.json(rows);
  } catch (error) {
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
    await executeQuery(query);
    let query1 = `SELECT apply.*,cases.caseName,influencer.influencerName,company.representativeName,company.emailAddress
    FROM apply
    LEFT JOIN cases ON apply.caseId = cases.id
    LEFT JOIN company ON cases.companyId = company.id
    LEFT JOIN influencer ON apply.influencerId = influencer.id
    `;
    const rows = await executeQuery(query1).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    if (rows.length) {
      return NextResponse.json({ type: "success", data: rows[0] });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ type: "error" });
  }
}
