import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../util/db";
import { RowDataPacket } from "mysql";
interface RowType extends RowDataPacket {
  // Define the structure of your row
  id: number;
  companyName: string;
  companyNameGana: string;
  representativeName: string;
  representativeNameGana: string;
  responsibleName: string;
  responsibleNameGana: string;
  webSite: string;
  phoneNumber: string;
  emailAddress: string;
  postalCode: string;
  address: string;
  building: string;
  status: string;
  payment: string;
  freeAccount: boolean;
  // Add any other fields you have in your table
}
export async function POST(request: NextRequest) {
  try {
    let body = await request.json();

    const query3 = `SELECT * FROM users where email = '${body.emailAddress}'`;
    const rows = await executeQuery(query3).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    if (!rows && !rows.length && rows.length === 0) {
      return NextResponse.json({ type: "error", msg: "no user" });
    }
    // const query4 = `SELECT * FROM company where emailAddress = '${body.emailAddress}'`;
    // const rows1 = await executeQuery(query4).catch((e) => {

    //   return NextResponse.json({ type: "error" });
    // });
    // if (rows1.length !== 0) {
    //   return NextResponse.json({ type: "error" });
    // }
    const user = rows[0];
    await executeQuery(
      `UPDATE users SET name = '${body.companyName}' WHERE id = ${user.id}`
    );
    const userId = user.id;

    const query4 = `SELECT * FROM plan`;
    const rows4 = await executeQuery(query4).catch((e) => {
      return NextResponse.json({ type: "error" });
    });

    const firstPlan = rows4[0];
    const today = new Date();
    const todayString = `${today.getFullYear()}/${
      today.getMonth() + 1
    }/${today.getDate()}`;
    const defaultValues = {
      status: "稼動中",
      date: todayString,
      payment: "",
      paymentId: "",
      paymentFailed: "",
      plan: 1,
      thisMonthCollectionCnt: 0,
      conCurrentCnt: 0,
      monthlyCollectionCnt: firstPlan.monthCnt,
      concurrentCollectionCnt: firstPlan.concurrentCnt,
      userId: userId,
    };
    body = { ...body, ...defaultValues };
    let query1 = "";
    let query2 = "";
    const keys = Object.keys(body);
    keys?.map((aKey) => {
      if (!(aKey === "priceID")) {
        query1 += aKey + ",";
        query2 +=
          typeof body[aKey] === "string"
            ? "'" + body[aKey] + "',"
            : +body[aKey] + ",";
      }
    });
    // insertQuery += `'${body["ds"]}'`;
    await executeQuery(`
    CREATE TABLE IF NOT EXISTS company (
      id INT AUTO_INCREMENT PRIMARY KEY,
      companyName VARCHAR(255)  ,
      companyNameGana VARCHAR(255)  ,
      representativeName VARCHAR(255)  ,
      representativeNameGana VARCHAR(255)  ,
      responsibleName VARCHAR(255)  ,
      responsibleNameGana VARCHAR(255)  ,
      webSite VARCHAR(255)  ,
      phoneNumber VARCHAR(255)  ,
      emailAddress VARCHAR(255)  ,
      postalCode VARCHAR(255)  ,
      address VARCHAR(255)  ,
      building VARCHAR(255)  ,
      status VARCHAR(255)  ,
      payment VARCHAR(255)  ,
      paymentId VARCHAR(255)  ,
      paymentFailed VARCHAR(255)  ,
      monthlyCollectionCnt int  ,
      concurrentCollectionCnt int  ,
      thisMonthCollectionCnt int ,
      paymentCnt int ,
      conCurrentCnt int,
      plan int,
      freeAccount BOOLEAN NOT NULL DEFAULT FALSE,
      userId int,
      date VARCHAR(255) NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (plan) REFERENCES plan(id)
    )
  `);
    console.log("Table created successfully!");
    const query = `INSERT INTO company (${query1.slice(
      0,
      -1
    )}) VALUES(${query2.slice(0, -1)})`;

    await executeQuery(query).catch((e) => {
      return NextResponse.json({ type: "error", msg: "error" });
    });
    return NextResponse.json({ type: "success", password: user.plainPassword });
  } catch (error) {
    console.error("Error creating table or inserting record:", error);
    return NextResponse.json({ type: "error", msg: "error" });
  }
}
export async function GET() {
  try {
    const query = "SELECT * FROM company ORDER BY id DESC";
    const rows = await executeQuery(query).catch((e) => {
      return NextResponse.json({ type: "error", msg: "no table exists" });
    });
    const deletingCompanyQuery = `DELETE message, chatroom, apply, cases, users
    FROM company
    LEFT JOIN users ON users.id = company.userId
    LEFT JOIN cases ON cases.companyId = company.id
    LEFT JOIN apply ON apply.caseId = cases.id
    LEFT JOIN chatroom ON chatroom.companyId = company.id
    LEFT JOIN message ON message.roomId = chatroom.id
    WHERE company.payment < NOW() AND users.active = 0`;

    const rows1 = await executeQuery(deletingCompanyQuery);

    // const deleteQuery = `DELETE FROM influencer WHERE emailAddress = '${userEmail}'`;
    //   const deleteUserQuery = `DELETE FROM users WHERE email = '${userEmail}'`;
    //   await executeQuery(deleteQuery);
    //   await executeQuery(deleteUserQuery);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ type: "error", msg: "no table exists" });
  }
}
export async function PUT(request: NextRequest) {
  try {
    let body = await request.json();
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
    let query = "UPDATE company SET ";
    const keys = Object.keys(body);

    const freeAccount =
      body.freeAccount == 1 || body.freeAccount == true ? 1 : 0;

    keys?.map((aKey) => {
      if (
        aKey !== "id" &&
        aKey !== "userId" &&
        aKey !== "priceID" &&
        aKey !== "active"
      ) {
        if (aKey === "freeAccount") {
          query += `${aKey} = ${freeAccount}, `;
        } else {
          query += `${aKey} = '${body[aKey]}', `;
        }
      }
    });
    query = query.slice(0, -2);
    query += " ";
    query += `WHERE id = ${body.id}`;

    await executeQuery(query).catch((e) => {
      return NextResponse.json({ type: "error", msg: "no table exists" });
    });
    const userQuery = `UPDATE users SET email = '${userEmail}' where id = ${body.userId}`;
    await executeQuery(userQuery).catch((e) => {
      return NextResponse.json({ type: "error" });
    });
    return NextResponse.json({ type: "success" });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ type: "error", msg: "no table exists" });
  }
}
