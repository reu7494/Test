import React from "react";

export default function Eliminate({ list, lists, setLists }) {
  return (
    <>
      <button
        onClick={() => {
          fetch(`http://localhost:8008/todos/${list.id}`, {
            method: "DELETE",
          }).then(() => {
            setLists(lists.filter((item) => item.id !== list.id));
          });
        }}
      >
        Delete
      </button>
    </>
  );
}
