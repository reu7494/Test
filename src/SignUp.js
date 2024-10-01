import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const nameRegEx = /^[가-힣a-zA-Z0-9]{3,12}$/;
  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
  const passwordRegEx =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

  const nameCheck = (userName) => {
    if (nameRegEx.test(userName) === false) {
      setError("유저명 형식을 확인하세요");
    }
  };
  const emailCheck = (email) => {
    if (emailRegEx.test(email) === false) {
      setError("이메일 형식을 확인하세요");
      return;
    }
  };

  const passwordCheck = (password) => {
    if (password.match(passwordRegEx) === null) {
      setError("비밀번호 형식을 확인해주세요");
      return;
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8008/Signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
          name: userName,
        }),
      });

      if (!response.ok) {
        alert("회원가입 실패");
      } else {
        alert("회원가입 성공!");
        navigate("/Login");
      }
    } catch (error) {
      setError("오류");
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={handleSignUp}>
        <label>유저명: </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
            nameCheck(e.target.value);
          }}
          required
        />
        <p>
          유저명은 한글, 영어(대소문자), 숫자만 허용하며 3자 이상 12자 이하로
          입력하세요
        </p>
        <label>이메일: </label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            emailCheck(e.target.value);
          }}
          required
        />
        <label>비밀번호: </label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            passwordCheck(e.target.value);
          }}
          required
        />
        <label>비밀번호 재입력: </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <p>영문 대소문자, 숫자, 특수문자를 혼합하여 8~20자로 입력하세요</p>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">회원가입</button>
        <Link to={"/Login"}>로그인</Link>
      </form>
    </div>
  );
}
