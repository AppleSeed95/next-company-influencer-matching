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
    console.error("Error connecting to the database:", error);
  } else {
    console.log("Connected to the database!");
    await connection.query(
      `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255)  ,
      password VARCHAR(255)  ,
      name VARCHAR(255) ,
      role VARCHAR(255) NOT NULL
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
