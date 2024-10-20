import { Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import LoginPage from "./LoginPage.js";
import SignUp from "./SignUp.js";
import List from "./List.js";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Login" element={<LoginPage setUser={setUser} />} />
        <Route path="/todos" element={<List user={user} setUser={setUser} />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </div>
  );
}
