import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);
        setUser(data.user);
        navigate(`/todos?userId=${data.user.id}`);
      }
    } catch (error) {
      alert("로그인 정보가 일치하지 않습니다. 다시 시도하세요.");
    }
  };

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
          <Link to={"/SignUp"}>회원가입</Link>
        </div>
      </form>
    </div>
  );
}
