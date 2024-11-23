const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const path = require("path");
const { prototype } = require("stream");
require("dotenv").config();

const app = express();
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:8000",
      "http://121.183.22.182:8000",
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS 정책에 의해 차단된 요청입니다."));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

// MySQL 데이터베이스 설정
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "todolistdatabase",
});

// MySQL 연결
db.connect((err) => {
  if (err) {
    console.error("데이터베이스에 연결 중 오류 발생:", err);
    return;
  }
  console.log("MySQL 데이터베이스에 연결됨");
});

// 유저명 중복 확인 API
app.post("/api/check-username", (req, res) => {
  const { userName } = req.body;

  if (!userName) {
    return res.status(400).send("유저명이 필요합니다.");
  }

  const checkQuery = "SELECT * FROM users WHERE userName = ?";
  db.query(checkQuery, [userName], (err, result) => {
    if (err) {
      console.error("사용자 존재 확인 오류:", err);
      return res.status(500).send("서버 오류");
    }

    if (result.length > 0) {
      return res.json({ exists: true }); // 유저명 중복
    } else {
      return res.json({ exists: false }); // 유저명 사용 가능
    }
  });
});

// 회원가입 API
app.post("/api/Signup", (req, res) => {
  const { email, password, userName } = req.body;

  if (!email || !password || !userName) {
    return res.status(400).send("Email, password 및 유저명이 필요합니다.");
  }

  const checkQuery = "SELECT * FROM users WHERE email = ? OR userName = ?";
  db.query(checkQuery, [email, userName], (err, result) => {
    if (err) {
      console.error("사용자 존재 확인 오류:", err);
      return res.status(500).send("서버 오류");
    }

    if (result.length > 0) {
      return res.status(400).send("이미 존재하는 이메일 또는 유저명입니다.");
    }

    const insertQuery =
      "INSERT INTO users (email, password, userName) VALUES (?, ?, ?)";
    db.query(insertQuery, [email, password, userName], (err, _result) => {
      if (err) {
        console.error("사용자 등록 오류:", err);
        return res.status(500).send("서버 오류");
      }
      res.status(201).send("사용자가 성공적으로 등록되었습니다.");
    });
  });
});

// 로그인 API
app.post("/api/Login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("이메일과 비밀번호가 필요합니다.");
  }

  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, result) => {
    if (err) {
      console.error("로그인 오류:", err);
      return res.status(500).send("서버 오류");
    }

    if (result.length === 0) {
      return res.status(401).send("잘못된 이메일 또는 비밀번호입니다.");
    }

    const user = result[0];

    res.json({
      user: { id: user.id, email: user.email, userName: user.userName },
    });
  });
});

// 사용자별 할 일 목록 가져오기
app.get("/api/todos", (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).send("사용자 ID가 필요합니다.");
  }

  const query = "SELECT * FROM todos WHERE user_id = ?";
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("가져오기 오류:", err);
      return res.status(500).send("서버 오류");
    }

    res.json(result);
  });
});

// 새로운 할 일 추가
app.post("/api/todos", (req, res) => {
  const { name, userId } = req.body;

  if (!name || !userId) {
    return res.status(400).send("작업 이름과 사용자 ID가 필요합니다.");
  }

  const query = "INSERT INTO todos (name, user_id) VALUES (?, ?)";
  db.query(query, [name, userId], (err, result) => {
    if (err) {
      console.error("작업 추가 오류:", err);
      return res.status(500).send("서버 오류");
    }

    res.status(201).json({ id: result.insertId, name });
  });
});

// 할 일 삭제
app.delete("/api/todos/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send("작업 ID가 필요합니다.");
  }

  const query = "DELETE FROM todos WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("삭제 오류:", err);
      return res.status(500).send("서버 오류");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Todo를 찾을 수 없음.");
    }

    res.send("Todo 삭제 성공");
  });
});

// 회원탈퇴 API
app.delete("/api/delete-user/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send("사용자 ID가 필요합니다.");
  }

  const deleteTodosQuery = "DELETE FROM todos WHERE user_id = ?";
  db.query(deleteTodosQuery, [id], (err, result) => {
    if (err) {
      console.error("todos 삭제 오류:", err);
      return res.status(500).send("서버 오류 - 할 일 삭제 실패");
    }

    const deleteUserQuery = "DELETE FROM users WHERE id = ?";
    db.query(deleteUserQuery, [id], (err, result) => {
      if (err) {
        console.error("사용자 삭제 오류:", err);
        return res.status(500).send("서버 오류 - 사용자 삭제 실패");
      }

      if (result.affectedRows === 0) {
        return res.status(404).send("사용자를 찾을 수 없습니다.");
      }

      res
        .status(200)
        .send("사용자 및 관련 작업관리가 성공적으로 삭제되었습니다.");
    });
  });
});

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:8008",
    "http://211.105.138.241:3000",
    "http://211.105.138.241:8000",
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.static(path.join(__dirname, "../build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.get("/api/health", (req, res) => {
  res.send({ status: "OK" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
