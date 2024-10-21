import { Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import LoginPage from "./LoginPage.js";
import SignUp from "./SignUp.js";
import List from "./List.js";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    const storedEmail = localStorage.getItem("userEmail");
    const storedUserName = localStorage.getItem("userName");

    if (storedId && storedEmail && storedUserName) {
      setUser({
        id: JSON.parse(storedId),
        email: JSON.parse(storedEmail),
        userName: JSON.parse(storedUserName),
      });
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage setUser={setUser} />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Login" element={<LoginPage setUser={setUser} />} />
        <Route path="/todos" element={<List user={user} setUser={setUser} />} />
      </Routes>
    </div>
  );
}
