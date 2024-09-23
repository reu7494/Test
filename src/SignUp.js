import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8008/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        alert("회원가입 오류");
        return;
      }

      alert("회원가입 성공!");
      navigate("/Login");
    } catch (error) {
      setError("다시 시도하세요");
    }
  };

  function openLogin() {
    navigate("/Login");
  }

  return (
    <div>
      <h2>계정추가</h2>
      <form onSubmit={handleSignUp}>
        <label>이메일:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>비밀번호:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>비밀번호 재입력:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error}
        <button type="submit">회원가입</button>
        <button type="button" onClick={openLogin}>
          로그인
        </button>
      </form>
    </div>
  );
}
