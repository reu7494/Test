import React from "react";

export default function Insertion({ name, setName, handleAdd }) {
  return (
    <>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAdd();
          }
        }}
      />
    </>
  );
}
