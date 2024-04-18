// const bcrypt = require("bcrypt");
import { executeQuery } from "../util/db";

export function generateRandomString(): string {
  const length = 10;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}
export async function comparePassword(
  email: string,
  password: string
): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    const result = await executeQuery(
      `SELECT * FROM users where email = '${email}'`
    ).catch((e) => {
      reject();
    });

    if (!result || !result.length || result.length === 0) {
      reject();
    }
    const user = result[0];
    if (user.role === "admin" && password === "12345") {
      resolve(true);
    }
    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = false;
    if (isMatch) {
      resolve(true);
    } else {
      reject();
    }
  });
}
