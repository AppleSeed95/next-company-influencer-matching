import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/app/api/util/db.js";
import { RowDataPacket } from "mysql";
interface RowType extends RowDataPacket {
  // Define the structure of your row
  id: number;
  caseType: string;
  caseName: string;
  caseContent: string;
  wantedHashTag: string;
  wantedSNS: string;
  casePlace: string;
  collectionStart: string;
  collectionEnd: string;
  caseEnd: string;
  collectionCnt: string;
  addtion: string;
  status: string;
  date: string;
  // Add any other fields you have in your table
}
export async function POST(request: NextRequest) {
  try {
    let body = await request.json();
    const companyId = body.companyId;
    const preQuery = `SELECT * FROM company where id=${companyId}`;
    const rows = await executeQuery(preQuery).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    const companyStatus = rows[0].status;
    if (companyStatus !== "稼働中" && companyStatus !== "稼動中") {
      return NextResponse.json({
        type: "error",
        msg: "稼働中ではないので申請できません。",
      });
    }
    const today = new Date();
    const todayString = `${today.getFullYear()}/${
      today.getMonth() + 1
    }/${today.getDate()}`;
    const defaultValues = {
      date: todayString,
      collectionStatus: "募集前",
      next: 0,
    };
    body = { ...body, ...defaultValues };
    let query1 = "";
    let query2 = "";
    const keys = Object.keys(body);
    let isReApply = false;
    keys?.map((aKey) => {
      if (aKey === "previous") isReApply = true;
      if (
        aKey === "id" ||
        aKey === "companyName" ||
        aKey === "emailAddress" ||
        aKey === "representativeName"
      )
        return;
      query1 += aKey + ",";
      query2 +=
        typeof body[aKey] === "string"
          ? "'" + body[aKey] + "',"
          : body[aKey] + ",";
    });
    // insertQuery += `'${body["ds"]}'`;
    await executeQuery(`
    CREATE TABLE IF NOT EXISTS cases (
      id INT AUTO_INCREMENT PRIMARY KEY,
      caseType VARCHAR(255) ,
      caseName VARCHAR(255) ,
      caseContent VARCHAR(255) ,
      wantedHashTag VARCHAR(255) ,
      wantedSNS VARCHAR(255) ,
      casePlace VARCHAR(255) ,
      collectionStart VARCHAR(255) ,
      collectionEnd VARCHAR(255) ,
      caseEnd VARCHAR(255) ,
      collectionCnt VARCHAR(255) ,
      addition VARCHAR(255) ,
      status VARCHAR(255) ,
      collectionStatus VARCHAR(255) ,
      date VARCHAR(255) ,
      reason VARCHAR(255) ,
      companyId int,
      previous int,
      next int,
      edited BOOLEAN  DEFAULT FALSE,
      autoStart BOOLEAN  DEFAULT FALSE,
      FOREIGN KEY (companyId) REFERENCES company(id)
    )
  `);
    console.log("Table created successfully!");
    const query = `INSERT INTO cases (${query1.slice(
      0,
      -1
    )}) VALUES(${query2.slice(0, -1)})`;

    const result = await executeQuery(query).catch((e) => {
      console.log(query);

      console.log(e);

      return NextResponse.json({ type: "error", msg: "error" });
    });
    let id = result.insertId;
    if (isReApply) {
      const query1 = `select * from cases where previous = ${body.previous}`;
      const row = await executeQuery(query1).catch((e) => {
        return NextResponse.json({ type: "error" });
      });
      const query2 = `update cases set next = ${row[0].id} where id = ${body.previous}`;
      const result = await executeQuery(query2).catch((e) => {
        return NextResponse.json({ type: "error" });
      });
      id = row[0].id;
    }
    return NextResponse.json({ type: "success", id });
  } catch (error) {
    console.error("Error creating table or inserting record:", error);
    return NextResponse.json({ type: "error", msg: "error" });
  }
}
export async function GET() {
  try {
    const query = `SELECT cases.*, company.companyName
    FROM cases
    LEFT JOIN company ON cases.companyId=company.id
    WHERE cases.status != '申請前'
    ORDER BY cases.id DESC`;

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
    const requestBody = await request.json();
    const companyId = requestBody.companyId;
    const preQuery = `SELECT * FROM company where id=${companyId}`;
    const rows = await executeQuery(preQuery).catch((e) => {
      return NextResponse.json({
        type: "error",
        msg: "稼働中ではないので申請できません。",
      });
    });

    const companyStatus = rows[0].status;
    if (companyStatus !== "稼働中" && companyStatus !== "稼動中") {
      return NextResponse.json({
        type: "error",
        msg: "承認されていないため、募集をうまくできません。",
      });
    }
    const body = { ...requestBody, edited: true };
    let query = "UPDATE cases SET ";
    const keys = Object.keys(body);

    keys?.map((aKey) => {
      if (
        aKey !== "id" &&
        aKey !== "companyId" &&
        aKey !== "companyName" &&
        aKey !== "emailAddress" &&
        aKey !== "representativeName"
      ) {
        query +=
          aKey === "edited" || aKey === "autoStart"
            ? `${aKey} = ${body[aKey]}, `
            : `${aKey} = '${body[aKey]}', `;
      }
    });
    query = query.slice(0, -2);
    query += " ";
    query += `WHERE id = ${body.id}`;
    executeQuery(query);
    return NextResponse.json({ type: "success" });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ type: "error" });
  }
}
