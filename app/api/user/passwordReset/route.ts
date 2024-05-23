import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../util/db";
import { generateRandomString } from "../util";
const bcrypt = require("bcrypt");

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const query3 = `SELECT * FROM users where email = '${email}'`;
    const rows = await executeQuery(query3).catch((e) => {
      return NextResponse.json({
        type: "error",
      });
    });

    if (rows.length === 0 || !rows.length) {
      return NextResponse.json({
        type: "error",
        msg: "入力に誤りがあります",
      });
    }
    const randomString = generateRandomString();
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(randomString, salt);
    await executeQuery(`
        UPDATE users SET password = '${hashedPassword}', plainPassword = '${randomString}'
        WHERE email = '${email}'
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
