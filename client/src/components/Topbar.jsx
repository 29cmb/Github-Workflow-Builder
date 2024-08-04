import React from "react";
import "../styles/Topbar.css";

function Topbar({ buttons }) {
    return (
        <div id="topbar">
            {buttons.map((b, index) => (
                <button key={index} onClick={() => {window.location.href = b[0]}} id="topbarBtn" class={b[2] === true ? "green" : "regular"}>{b[1]}</button>
            ))}
        </div>
    );
}

export default Topbar;