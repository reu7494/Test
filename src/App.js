import { Route, Routes } from "react-router-dom";
import React, { useState } from "react";
import LoginPage from "./LoginPage.js";
import SignUp from "./SignUp.js";
import List from "./List.js";

export default function App() {
  const [user, setUser] = useState(null); // 로그인된 사용자 상태 관리

  return (
    <div>
      {!user ? (
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/Login" element={<LoginPage setUser={setUser} />} />
          <Route path="/SignUp" element={<SignUp />} />
        </Routes>
      ) : (
        <Routes>
          <Route
            path="/todos"
            element={<List user={user} setUser={setUser} />}
          />
        </Routes>
      )}
    </div>
  );
}
