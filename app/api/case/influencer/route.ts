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
    const today = new Date();
    const todayString = `${today.getFullYear()}/${
      today.getMonth() + 1
    }/${today.getDate()}`;
    const defaultValues = {
      date: todayString,
      collectionStatus: "募集前",
    };
    body = { ...body, ...defaultValues };
    let query1 = "";
    let query2 = "";
    const keys = Object.keys(body);
    keys?.map((aKey) => {
      if (aKey !== "id") {
        query1 += aKey + ",";
        query2 += "'" + body[aKey] + "',";
      }
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
      edited BOOLEAN  DEFAULT FALSE,
      FOREIGN KEY (companyId) REFERENCES company(id)
    )
  `);
    console.log("Table created successfully!");
    const query = `INSERT INTO cases (${query1.slice(
      0,
      -1
    )}) VALUES(${query2.slice(0, -1)})`;

    const result = await executeQuery(query).catch((e) => {
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
export async function GET() {
  try {
    const query = `SELECT cases.*, company.companyName
    FROM cases
    LEFT JOIN company ON cases.companyId=company.id 
    where collectionStatus = '募集中' AND company.status = '稼動中' ORDER BY id DESC`;

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
    const requestBody = await request.json();
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
          aKey === "edited"
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
    throw new Error("something went wrong");
    console.error("Error fetching data:", error);
    return NextResponse.json({ type: "error" });
  }
}
