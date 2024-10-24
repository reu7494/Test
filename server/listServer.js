const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const PORT = process.env.PORT || 8008;
const path = require("path");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key";
const apiUrl = process.env.REACT_APP_API_URL;

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
    console.error("데이터베이스에 연결 중 오류 발생:", err);
    return;
  }
  console.log("MySQL 데이터베이스에 연결됨");
});

// 유저명 중복 확인 API
app.post("/check-username", (req, res) => {
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
app.post("/Signup", (req, res) => {
  const { email, password, userName } = req.body;

  if (!email || !password || !userName) {
    return res.status(400).send("Email, password 및 유저명이 필요합니다.");
  }

  // 이메일 또는 유저명 중복 확인
  const checkQuery = "SELECT * FROM users WHERE email = ? OR userName = ?";
  db.query(checkQuery, [email, userName], (err, result) => {
    if (err) {
      console.error("사용자 존재 확인 오류:", err);
      return res.status(500).send("서버 오류");
    }

    if (result.length > 0) {
      return res.status(400).send("이미 존재하는 이메일 또는 유저명입니다.");
    }

    // 유저 등록
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
app.post("/Login", (req, res) => {
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

    // JWT 토큰 발급
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({
      user: { id: user.id, email: user.email, userName: user.userName },
      token, // 클라이언트로 토큰 전달
    });
  });
});

// 사용자별 할 일 목록 가져오기
app.get("/todos", (req, res) => {
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
app.post("/todos", (req, res) => {
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
app.delete("/todos/:id", (req, res) => {
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
app.delete("/delete-user/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send("사용자 ID가 필요합니다.");
  }

  // 사용자의 할 일 목록 삭제
  const deleteTodosQuery = "DELETE FROM todos WHERE user_id = ?";
  db.query(deleteTodosQuery, [id], (err, result) => {
    if (err) {
      console.error("todos 삭제 오류:", err);
      return res.status(500).send("서버 오류 - 할 일 삭제 실패");
    }

    // 사용자 삭제
    const deleteUserQuery = "DELETE FROM users WHERE id = ?";
    db.query(deleteUserQuery, [id], (err, result) => {
      if (err) {
        console.error("사용자 삭제 오류:", err);
        return res.status(500).send("서버 오류 - 사용자 삭제 실패");
      }

      if (result.affectedRows === 0) {
        return res.status(404).send("사용자를 찾을 수 없습니다.");
      }

      // 성공적으로 삭제된 경우
      res
        .status(200)
        .send("사용자 및 관련 작업관리가 성공적으로 삭제되었습니다.");
    });
  });
});

app.use(express.static(path.join(__dirname, "build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log("서버가 https://jotup.netlify.app에서 실행 중입니다");
});
