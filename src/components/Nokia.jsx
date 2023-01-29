import React from "react";
import NokiaSVG from "../assets/nokia-3310-seeklogo.com.svg";

function Nokia() {
  return (
    <>
      <img className="Nokia_sample" src={NokiaSVG} />
      <div className="Nokia">
        <div className="main_buttons">
          <div className="big_button"></div>
          <div className="c_button">c</div>
        </div>
      </div>
    </>
  );
}

export default Nokia;
