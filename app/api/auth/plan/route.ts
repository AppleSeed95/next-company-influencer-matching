import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "../../util/db";

export async function POST(request: NextRequest) {
  try {
    const { name, priceID, monthCnt, concurrentCnt } = await request.json();
    await executeQuery(`
            INSERT INTO plan (name, priceID, monthCnt, concurrentCnt)
            VALUES ('${name}', '${priceID}',${monthCnt},${concurrentCnt})
          `).catch((e) => {
      throw new Error("something went wrong");
      return NextResponse.json({ type: "error" });
    });
    return NextResponse.json({ type: "success" });
  } catch (error) {
    throw new Error("something went wrong");
    return NextResponse.json({ type: "error" });
  }
}
export async function PUT(request: NextRequest) {
  try {
    const { id, name, priceID, monthCnt, concurrentCnt } = await request.json();
    const query = `
      UPDATE plan set name = '${name}', priceID = '${priceID}', monthCnt = ${monthCnt}, concurrentCnt = ${concurrentCnt} WHERE id = ${id}
    `;

    await executeQuery(query).catch((e) => {
      throw new Error("something went wrong");
      return NextResponse.json({ type: "error" });
    });
    return NextResponse.json({ type: "success" });
  } catch (error) {
    throw new Error("something went wrong");
    return NextResponse.json({ type: "error" });
  }
}
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") || "";
  try {
    const preQuery = `SELECT COUNT(*) AS count FROM plan`;
    const count = await executeQuery(preQuery);
    if (count[0].count === 1) {
      return NextResponse.json({ type: "one" });
    }
    const query = `
      DELETE from plan WHERE id = ${id}
    `;
    await executeQuery(query).catch((e) => {
      throw new Error("something went wrong");
      return NextResponse.json({ type: "error" });
    });
    return NextResponse.json({ type: "success" });
  } catch (error) {
    throw new Error("something went wrong");
    return NextResponse.json({ type: "error" });
  }
}

export async function GET() {
  try {
    const plan = await executeQuery(`SELECT * from plan `).catch((e) => {
      throw new Error("something went wrong");
      return NextResponse.json({ type: "error" });
    });
    return NextResponse.json({ type: "success", data: plan });
  } catch (error) {
    throw new Error("something went wrong");
    return NextResponse.json({ type: "error" });
  }
}
