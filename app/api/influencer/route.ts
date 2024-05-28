import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../util/db";

export async function POST(request: NextRequest) {
  try {
    let body = await request.json();

    const query3 = `SELECT * FROM users where email = '${body.emailAddress}'`;
    const rows = await executeQuery(query3).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    if (!rows || !rows.length || rows.length === 0) {
      return NextResponse.json({ type: "error", msg: "no user" });
    }
    // const query4 = `SELECT * FROM influencer where emailAddress = '${body.emailAddress}'`;
    // const rows1 = await executeQuery(query4).catch((e) => {
    //   return NextResponse.json({ type: "error" });
    // });
    // if (rows1.length !== 0) {
    //   return NextResponse.json({ type: "error" });
    // }
    const user = rows[0];

    await executeQuery(
      `UPDATE users SET name = '${body.nickName}' WHERE id = ${user.id}`
    );
    const userId = user.id;

    const today = new Date();
    const todayString = `${today.getFullYear()}/${
      today.getMonth() + 1
    }/${today.getDate()}`;
    const defaultValues = {
      status: "承認待ち",
      date: todayString,
      userId: userId,
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
      CREATE TABLE IF NOT EXISTS influencer (
        id INT AUTO_INCREMENT PRIMARY KEY,
        influencerName VARCHAR(255)  ,
        influencerNameGana VARCHAR(255)  ,
        gender VARCHAR(255)  ,
        nickName VARCHAR(255)  ,
        phoneNumber VARCHAR(255)  ,
        emailAddress VARCHAR(255)  ,
        prefecture VARCHAR(255)  ,
        genre VARCHAR(255)  ,
        instagram VARCHAR(255)  ,
        x VARCHAR(255)  ,
        facebook VARCHAR(255)  ,
        youtube VARCHAR(255)  ,
        tiktok VARCHAR(255)  ,
        otherSNS VARCHAR(255)  ,
        userId int,
        date VARCHAR(255),
        status VARCHAR(255), 
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);
    console.log("Table created successfully!");
    const query = `INSERT INTO influencer (${query1.slice(
      0,
      -1
    )}) VALUES(${query2.slice(0, -1)})`;
    const influencerIdQuery = `SELECT id FROM influencer WHERE userID = ${user.id}`;
    const influencer = await executeQuery(influencerIdQuery);
    console.log(influencer[0].id);
    await executeQuery(query).catch((e) => {
      return NextResponse.json({ type: "error", msg: "error" });
    });
    return NextResponse.json({
      type: "success",
      password: user.plainPassword,
      id: user.id,
    });
  } catch (error) {
    console.error("Error creating table or inserting record:", error);
    return NextResponse.json({ type: "error", msg: "error" });
  }
}
export async function GET() {
  try {
    const query = "SELECT * FROM influencer ORDER BY id DESC";
    const rows = await executeQuery(query).catch((e) => {
      return NextResponse.json({ type: "error", msg: "no table exists" });
    });
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ type: "error", msg: "no table exists" });
  }
}
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const userEmail = body.emailAddress;
    const query1 = `select id, plainPassword from users where email = '${userEmail}'`;
    const rows1 = await executeQuery(query1).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    if (rows1.length > 0 && rows1[0].id !== body.userId) {
      return NextResponse.json({
        type: "error",
        msg: "入力したEメールアドレスがすでに登録されています。",
      });
    }
    const query2 = `select id, plainPassword from users where id = ${body.userId}`;
    const rows2 = await executeQuery(query2).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    let query = "UPDATE influencer SET ";
    const keys = Object.keys(body);
    keys?.map((aKey) => {
      if (aKey !== "id" && aKey !== "userId") {
        query += `${aKey} = '${body[aKey]}', `;
      }
    });
    query = query.slice(0, -2);
    query += " ";
    query += `WHERE id = ${body.id}`;

    await executeQuery(query).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    const userQuery = `UPDATE users SET email = '${userEmail}' where id = ${body.userId}`;

    await executeQuery(userQuery).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    return NextResponse.json({
      type: "success",
      password: rows2[0].plainPassword,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ type: "error" });
  }
}
