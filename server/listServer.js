const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const PORT = process.env.PORT || 8008;

const app = express();
app.use(cors());
app.use(express.json());

// MySQL 데이터베이스 설정
const db = mysql.createConnection({
  host: "localhost", // MySQL 호스트
  user: "root", // MySQL 사용자 이름
  password: "1234", // MySQL 비밀번호
  database: "todolistdatabase", // 사용할 데이터베이스
});

// MySQL 연결
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database");
});

// 모든 할 일을 가져오는 API
app.get("/todos", (req, res) => {
  db.query("SELECT * FROM todos", (err, result) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Server error");
    } else {
      res.json(result);
    }
  });
});

// 새로운 할 일을 추가하는 API
app.post("/todos", (req, res) => {
  const { name } = req.body;
  const query = "INSERT INTO todos (name) VALUES (?)";
  db.query(query, [name], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).send("Server error");
    } else {
      res.status(201).json({ id: result.insertId, name });
    }
  });
});

// 할 일을 삭제하는 API
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM todos WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err);
      res.status(500).send("Server error");
    } else {
      res.send("Todo deleted");
    }
  });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server run : http://localhost:${PORT}/todos`);
});
