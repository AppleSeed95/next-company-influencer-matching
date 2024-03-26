import { NextRequest, NextResponse } from "next/server";
import { generateRandomString } from "./util";
import { executeQuery } from "../util/db";
const bcrypt = require("bcrypt");

export async function POST(request: NextRequest) {
  try {
    await executeQuery(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255)  ,
          email VARCHAR(255)  
        )
      `);
    console.log("Table created successfully!");

    const result = await executeQuery(`
    INSERT INTO users (name, email)
    VALUES ('John Doye', 'john@exatmple.com')
  `).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    console.log("Record inserted successfully!", result);
    return NextResponse.json({ res: "success" });
  } catch (error) {
    console.error("Error creating table or inserting record:", error);
    return NextResponse.json({ error: error });
  }
}
export async function PUT(request: NextRequest) {
  try {
    const { email, type } = await request.json();
    const query3 = `SELECT * FROM users where email = '${email}'`;
    const rows = await executeQuery(query3).catch((e) => {
      return NextResponse.json({
        type: "error",
      });
    });

    if (rows.length !== 0) {
      return NextResponse.json({
        type: "error",
        msg: "メールアドレスが既に登録されている",
      });
    }
    const randomString = generateRandomString();
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    await executeQuery(`
      INSERT INTO users (email,password ,role)
      VALUES ('${email}','${"12345"}','${type}')
      `);
    return NextResponse.json({
      type: "success",
      data: { email, password: randomString },
    });
  } catch (e) {
    console.error("Error creating user record:", e);
    return NextResponse.json({ type: "error" });
  }
}
