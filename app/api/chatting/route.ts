import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../util/db";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let query1 = "";
    let query2 = "";
    const keys = Object.keys(body);
    keys?.map((aKey) => {
      query1 += aKey + ",";
      if (aKey === "roomId" || aKey === "userId") {
        query2 += " " + body[aKey] + " , ";
      } else {
        query2 += "'" + body[aKey] + "',";
      }
    });
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS message ( 
        id INT AUTO_INCREMENT PRIMARY KEY,
        roomId int,
        userId int,        
        day VARCHAR(255),
        msg VARCHAR(255),
        time VARCHAR(255), 
        FOREIGN KEY (roomId) REFERENCES apply(id),
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);
    const query = `INSERT INTO message (${query1.slice(
      0,
      -1
    )}) VALUES(${query2.slice(0, -1)})`;

    await executeQuery(query).catch((e) => {
      return NextResponse.json({ type: "error", msg: "error" });
    });
    return NextResponse.json({ type: "success" });
  } catch (error) {
    console.error("Error", error);
    return NextResponse.json({ type: "error", msg: "error" });
  }
}
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id") || "";
    const query = `SELECT message.*,users.name FROM message
    LEFT JOIN users ON message.userId = users.id 
    where roomId = ${id}`;
    const rows = await executeQuery(query).catch((e) => {
      return NextResponse.json({ type: "error", msg: "no table exists" });
    });
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ type: "error", msg: "no table exists" });
  }
}
