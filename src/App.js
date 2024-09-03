import { useState } from "react";

let nextList = [
  { id: 0, name: "세탁기 작동시키기" },
  { id: 1, name: "배추 구매하기" },
];

let nextId = 2;
if (nextList.id === 0) {
  nextId = 1;
} else if (nextList.id === 1) {
  nextId = 0;
}

export default function List() {
  const [name, setName] = useState();
  const [lists, setLists] = useState(nextList);

  function handleAdd() {
    setName("");
    setLists([...lists, { id: nextId++, name: name }]);
  }
  return (
    <>
      <h1>To Do List</h1>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAdd();
          }
        }}
      />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {lists.map((list) => (
          <li key={list.id}>
            {list.name}{" "}
            <button
              onClick={() => {
                setLists(lists.filter((a) => a.id !== list.id));
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
