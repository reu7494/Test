import { useState } from "react";

let nextList = [
  { id: 0, name: "세탁기 작동시키기" },
  { id: 1, name: "배추 구매하기" },
];

let nextId = 2;

export default function List() {
  const [name, setName] = useState();
  const [list, setList] = useState(nextList, []);
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
