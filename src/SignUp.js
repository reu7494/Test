import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function SignUp() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [formErrors, setFormErrors] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const nameRegEx = /^[a-z][a-z0-9-_]{2,20}$/;
  const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegEx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;

  const checkUserNameDuplicate = async (userName) => {
    const response = await fetch(`${apiUrl}/check-username`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName }),
    });

    const data = await response.json();
    return data.exists;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    let validationErrors = {};

    // 유저명 형식 체크
    if (!nameRegEx.test(userName)) {
      validationErrors.userName = "유저명 형식을 확인하세요.";
    }

    // 이메일 형식 체크
    if (!emailRegEx.test(email)) {
      validationErrors.email = "이메일 형식을 확인하세요.";
    }

    // 비밀번호 형식 체크
    if (!passwordRegEx.test(password)) {
      validationErrors.password = "비밀번호 형식을 확인하세요.";
    }

    // 비밀번호 확인 체크
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 오류가 있을 경우 화면에 표시
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    // 유저명 중복 체크
    const isUserNameDuplicate = await checkUserNameDuplicate(userName);
    if (isUserNameDuplicate) {
      setError("이미 사용 중인 유저명입니다.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/Signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          userName: userName,
        }),
      });

      if (!response.ok) {
        Swal.fire({
          title: "",
          text: "회원가입 실패",
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "",
          text: "회원가입 성공!",
          icon: "success",
        });
        navigate("/Login");
      }
    } catch (error) {
      setError("오류 발생");
    }
  };

  return (
    <div className="container">
      <h2>회원가입</h2>
      <form onSubmit={handleSignUp}>
        <div className="form-field">
          <label>유저명: </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              setFormErrors((prev) => ({ ...prev, userName: "" }));
            }}
            required
          />
          <p>2~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용가능합니다.</p>
          {formErrors.userName && (
            <p className="error-styles">{formErrors.userName}</p>
          )}
        </div>

        <div className="form-field">
          <label>이메일: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFormErrors((prev) => ({ ...prev, email: "" }));
            }}
            required
          />
          {formErrors.email && (
            <p className="error-styles">{formErrors.email}</p>
          )}
        </div>

        <div className="form-field">
          <label>비밀번호: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFormErrors((prev) => ({ ...prev, password: "" }));
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
          <p>8~20자 영문 대 소문자, 숫자를 사용하세요.</p>
        </div>

        {formErrors.password && (
          <p className="error-styles">{formErrors.password}</p>
        )}
        {error && <p className="error-styles">{error}</p>}

        <button type="submit">회원가입</button>
        <Link to={"/Login"} className="link-button">
          로그인
        </Link>
      </form>
    </div>
  );
}
