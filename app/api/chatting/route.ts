import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../util/db";
export async function POST(request: NextRequest) {
  try {
    let body = await request.json();
    const chunks = body?.msg.match(new RegExp(`.{1,${50}}`, "g"));
    const result = chunks.join("\n");
    body.msg = result;
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
        checked BOOLEAN NOT NULL DEFAULT FALSE,
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
  const id = request.nextUrl.searchParams.get("id") || "";
  const target = request.nextUrl.searchParams.get("target") || "";
  const user = request.nextUrl.searchParams.get("user") || "";
  const role = request.nextUrl.searchParams.get("role") || "";

  try {
    const preQuery = `SELECT * from chatroom where applyId = ${id}`;
    const room = await executeQuery(preQuery).catch((e) => {
      return NextResponse.json({ type: "error", msg: "no table exists" });
    });

    const isValid =
      role === "インフルエンサー"
        ? room[0].influencerId == target
        : room[0].companyId == target;

    const checkQuery = `
      UPDATE message SET checked = 1 WHERE userId != ${user} and roomId = ${id}
    `;
    await executeQuery(checkQuery).catch((e) => {
      return NextResponse.json({ type: "error", msg: "no table exists" });
    });
    const query = `SELECT message.*,users.name FROM message
    LEFT JOIN users ON message.userId = users.id 
    where roomId = ${id}`;
    const rows = await executeQuery(query).catch((e) => {
      return NextResponse.json({ type: "error", msg: "no table exists" });
    });

    return NextResponse.json({ messages: rows, valid: isValid });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ type: "error", msg: "no table exists" });
  }
}
