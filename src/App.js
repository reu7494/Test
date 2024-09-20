//https://inherent-danit-orientaluniversity-6510c6dd.koyeb.app/

import { Route, Routes } from "react-router-dom";
import React, { useState } from "react";
import LoginPage from "./LoginPage";
import SignUp from "./SignUp";
import List from "./List";

export default function App() {
  const [user, setUser] = useState(null); // 로그인된 사용자 상태 관리

  return (
    <div>
      {!user ? (
        <Routes>
          <Route path="/" element={<LoginPage setUser={setUser} />} />
          <Route path="/SignUp" element={<SignUp />} />
        </Routes>
      ) : (
        <List user={user} setUser={setUser} /> // 로그인된 사용자에게 할 일 목록 표시
      )}
    </div>
  );
}
