import React from "react";

function Popup({ reset }) {
  return (
    <div className="popup">
      <p>Game Over!</p>
      <button onClick={reset}>reset</button>
    </div>
  );
}

export default Popup;
