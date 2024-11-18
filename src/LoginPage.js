import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function LoginPage({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "로그인 실패");
      } else {
        const { id, email, userName } = data.user;
        localStorage.setItem("userId", JSON.stringify(id));
        localStorage.setItem("userEmail", JSON.stringify(email));
        localStorage.setItem("userName", JSON.stringify(userName));
        setUser({ id, email, userName });
        navigate(`/todos?userId=${id}`);
      }
    } catch (error) {
      Swal.fire({
        title: "",
        text: "로그인 정보가 일치하지 않습니다. 다시 시도하세요.",
        icon: "warning",
      });
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-field">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="button-group">
          <button type="submit">로그인</button>
          <Link to={"/SignUp"}>회원가입</Link>
        </div>
      </form>
    </div>
  );
}
