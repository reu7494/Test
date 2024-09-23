import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8008/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "로그인 실패");
        return;
      }

      setUser(data.user); // 로그인 성공 시 사용자 정보 저장
      navigate("/List");
    } catch (error) {
      alert("로그인 정보가 일치하지 않습니다. 다시 시도하세요.");
    }
  };
  function OpenSign() {
    navigate("/SignUp");
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div>
          {error}
          <button type="submit">로그인</button>
          <button type="button" onClick={OpenSign}>
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
}
