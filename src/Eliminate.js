import React from "react";

export default function Eliminate({ list, lists, setLists }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  return (
    <>
      <button
        onClick={() => {
          fetch(`${apiUrl}/api/todos/${list.id}`, {
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
