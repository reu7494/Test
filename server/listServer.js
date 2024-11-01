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
