import { useState, useEffect, useCallback } from "react";
import LogoutPage from "./LogoutPage.js";
import Insertion from "./Insertion.js";
import Eliminate from "./Eliminate.js";
import { useNavigate } from "react-router-dom";

export default function List({ user, setUser }) {
  const [name, setName] = useState("");
  const [lists, setLists] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchTodos = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:8008/todos?userId=${user.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch Todos");

      const data = await response.json();
      setLists(data);
    } catch (error) {
      console.error("Error fetching Todos:", error);
      setError("Failed to load tasks.");
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchTodos();
  }, [user, fetchTodos]);

  const handleAdd = async () => {
    if (!name.trim()) return;

    try {
      const response = await fetch("http://localhost:8008/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, userId: user.id }),
      });

      if (!response.ok) throw new Error("Failed to add todo");

      setName(""); // 입력 필드 초기화
      fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
      setError("Failed to add task.");
    }
  };

  // 회원탈퇴 요청
  const handleDeleteAccount = async () => {
    if (!window.confirm("탈퇴를 진행하시겠습니까?")) return;

    try {
      const response = await fetch(
        `http://localhost:8008/delete-user/${user.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete account");

      alert("회원탈퇴 성공");
      setUser(null); // 사용자 로그아웃 처리
      navigate("/Login");
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Failed to delete account.");
    }
  };

  return (
    <div className="todo-container">
      <h1>{user.userName}'s To Do List</h1>
      <Insertion name={name} setName={setName} handleAdd={handleAdd} />
      <button onClick={handleAdd}>Add</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="scroll">
        <ul>
          {lists.map((list) => (
            <li key={list.id}>
              {list.name}
              <Eliminate list={list} lists={lists} setLists={setLists} />
            </li>
          ))}
        </ul>
      </div>
      <LogoutPage setUser={setUser} />
      <button onClick={handleDeleteAccount}>회원탈퇴</button>
    </div>
  );
}
