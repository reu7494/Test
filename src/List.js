import { useState, useEffect } from "react";
import Insertion from "./Insertion.js";
import Eliminate from "./Eliminate.js";

export default function List({ user, setUser }) {
  const [name, setName] = useState("");
  const [lists, setLists] = useState([]);
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    try {
      const response = await fetch(
        `http://localhost:8008/todos?userId=${user.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch todos");

      const data = await response.json();
      setLists(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setError("Failed to load tasks.");
    }
  };

  useEffect(() => {
    if (user) fetchTodos();
  }, [user]);

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
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:8008/delete-user/${user.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete account");

      alert("Account deleted successfully.");
      setUser(null); // 사용자 로그아웃 처리
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Failed to delete account.");
    }
  };

  return (
    <div>
      <h1>{user.email}'s To Do List</h1>
      <Insertion name={name} setName={setName} handleAdd={handleAdd} />
      <button onClick={handleAdd}>Add</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {lists.map((list) => (
          <li key={list.id}>
            {list.name}
            <Eliminate list={list} lists={lists} setLists={setLists} />
          </li>
        ))}
      </ul>
      <button onClick={handleDeleteAccount} style={{ color: "red" }}>
        Delete Account
      </button>
    </div>
  );
}
