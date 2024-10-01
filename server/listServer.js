const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const PORT = process.env.PORT || 8008;

const app = express();
app.use(cors());
app.use(express.json());

// MySQL 데이터베이스 설정
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "todolistdatabase",
});

// MySQL 연결
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database");
});

// 회원가입 API
app.post("/Signup", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required.");
  }

  const checkQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkQuery, [email], (err, result) => {
    if (err) {
      console.error("Error checking user existence:", err);
      return res.status(500).send("Server error");
    }

    if (result.length > 0) {
      return res.status(400).send("Email already exists.");
    }

    const insertQuery = "INSERT INTO users (email, password) VALUES (?, ?)";
    db.query(insertQuery, [email, password], (err, _result) => {
      if (err) {
        console.error("Error registering user:", err);
        return res.status(500).send("Server error");
      }
      res.status(201).send("User registered successfully.");
    });
  });
});

// 로그인 API
app.post("/Login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required.");
  }

  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, result) => {
    if (err) {
      console.error("Error logging in:", err);
      return res.status(500).send("Server error");
    }

    if (result.length === 0) {
      return res.status(401).send("Invalid email or password.");
    }

    const user = result[0];
    res.json({ user: { id: user.id, email: user.email } });
  });
});

// 사용자별 할 일 목록 가져오기
app.get("/todos", (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).send("User ID is required.");
  }

  const query = "SELECT * FROM todos WHERE user_id = ?";
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching todos:", err);
      return res.status(500).send("Server error");
    }

    res.json(result);
  });
});

// 새로운 할 일 추가
app.post("/todos", (req, res) => {
  const { name, userId } = req.body;

  if (!name || !userId) {
    return res.status(400).send("Task name and user ID are required.");
  }

  const query = "INSERT INTO todos (name, user_id) VALUES (?, ?)";
  db.query(query, [name, userId], (err, result) => {
    if (err) {
      console.error("Error adding todo:", err);
      return res.status(500).send("Server error");
    }

    res.status(201).json({ id: result.insertId, name });
  });
});

// 할 일 삭제
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send("Todo ID is required.");
  }

  const query = "DELETE FROM todos WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting todo:", err);
      return res.status(500).send("Server error");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Todo not found.");
    }

    res.send("Todo deleted successfully.");
  });
});

// 회원탈퇴 API
app.delete("/delete-user/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send("User ID is required.");
  }

  const query = "DELETE FROM users WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).send("Server error");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("User not found.");
    }

    res.send("User and related todos deleted successfully.");
  });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:8008/`);
});
