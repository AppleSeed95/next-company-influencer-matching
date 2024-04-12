import mysql from "mysql";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "project",
});

// Connect to the MySQL database
connection.connect(async (error) => {
  if (error) {
    console.error("Error occured while connecting to the database:", error);
  } else {
    console.log("Connected to the database!");
    await connection.query(
      `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255)  ,
      password VARCHAR(255)  ,
      name VARCHAR(255) ,
      role VARCHAR(255)  ,
      applyTime VARCHAR(255),
      plainPassword VARCHAR(255),
      active BOOLEAN NOT NULL DEFAULT TRUE
    )
  `,
      (error, result) => {
        if (error) {
          console.error("Error creating users table:", error);
          return;
        }
        console.log("Users table created successfully!");
        connection.query(
          "SELECT COUNT(*) AS count FROM users where role = 'admin'",
          (error, result) => {
            if (error) {
              console.error("Error counting admin:", error);
              return;
            }
            if (result[0].count !== 0) {
              console.log("Admin already exists.");
            } else {
              connection.query(
                `
              INSERT INTO users (email,password,name ,role)
              VALUES ('test@gmail.com','12345','管理者' ,'admin')
              `,
                (error, result) => {
                  if (error) {
                    console.error("Error creating admin:", error);
                    return;
                  } else {
                    connection.query(
                      `
                      CREATE TABLE IF NOT EXISTS plan (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255)  ,
                        priceID VARCHAR(255)  ,
                        monthCnt int  ,
                        concurrentCnt int
                      )
                      `, (error, result) => {
                      if (error) {
                        console.error("Error creating plan:", error);
                        return;
                      }
                      connection.query(`
                      SELECT COUNT(*) AS count FROM plan
                      `, (error, result) => {
                        if (error) {
                          console.error("Error counting plan:", error);
                          return;
                        }
                        if (result[0].count !== 0) {
                          console.log("plan already exists.");
                        } else {
                          connection.query(
                            `
                          INSERT INTO plan (name,priceID,monthCnt ,concurrentCnt)
                          VALUES ('fist','price_1Ox1PQHeC7VfJv8UA2wSiBeX',3 ,3)
                          `, (error, result) => {
                            if (error) {
                              console.error("Error creating admin:", error);
                            }
                          })
                        }
                      }
                      )
                      console.log("Plan created successfully.");
                    }
                    )
                  }
                  console.log("Admin created successfully.");
                }
              );

            }
          }
        );
      }
    );
  }
});

export const executeQuery = async (query) => {
  const result = await new Promise((resolve, reject) => {
    connection.query(query, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
  return result;
};
