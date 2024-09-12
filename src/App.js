//https://inherent-danit-orientaluniversity-6510c6dd.koyeb.app/

import { useState, useEffect } from "react";
import Insertion from "./Insertion.js";
import Eliminate from "./Eliminate.js";

// React 컴포넌트
export default function List() {
  const [name, setName] = useState("");
  const [lists, setLists] = useState([]);

  // 서버에서 데이터 가져오기
  useEffect(() => {
    fetch("http://localhost:8008/todos") // 서버에서 todos 리스트 가져오기
      .then((response) => response.json())
      .then((data) => setLists(data))
      .catch((error) => console.error("Error fetching todos:", error));
  }, []);

  // 새로운 항목 추가
  function handleAdd() {
    fetch("http://localhost:8008/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }), // 서버로 새 데이터 전송
    })
      .then(() => {
        setName(""); // 입력 필드 초기화
        return fetch("http://localhost:8008/todos") // 다시 데이터를 가져와서 업데이트
          .then((response) => response.json())
          .then((data) => setLists(data));
      })
      .catch((error) => console.error("Error adding todo:", error));
  }

  return (
    <>
      <h1>To Do List</h1>
      <Insertion name={name} setName={setName} handleAdd={handleAdd} />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {lists.map((list) => (
          <li key={list.id}>
            {list.name}
            <Eliminate list={list} lists={lists} setLists={setLists} />
          </li>
        ))}
      </ul>
    </>
  );
}
