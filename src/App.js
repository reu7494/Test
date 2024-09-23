//https://inherent-danit-orientaluniversity-6510c6dd.koyeb.app/

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
            pate="/List"
            element={<List user={user} setUser={setUser} />}
          />
        </Routes>
      )}
    </div>
  );
}
