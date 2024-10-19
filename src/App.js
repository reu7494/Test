import { Route, Routes } from "react-router-dom";
import React, { useState } from "react";
import LoginPage from "./LoginPage.js";
import SignUp from "./SignUp.js";
import List from "./List.js";

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      <Routes>
        <Route path="/Login" element={<LoginPage setUser={setUser} />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/todos" element={<List user={user} setUser={setUser} />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </div>
  );
}
