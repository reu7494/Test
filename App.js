import { useState } from "react";

let nextId = 0;

export default function List() {
  const [name, setName] = useState("");
  const [list, setList] = useState([]);
  return (
    <>
      <h1>To Do List</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button
        onClick={() => {
          setList([...list, { id: nextId++, name: name }]);
        }}
      >
        Add
      </button>
      <ul>
        {list.map((list) => (
          <li key={list.id}>{list.name}</li>
        ))}
      </ul>
    </>
  );
}
