import React from "react";
import "../styles/Sidebar.css";

function Sidebar({ buttons }) {
    return (
        <div id="sidebar">
            {buttons.map((b, index) => (
                <>
                    <button key={index} className={b[2] ? "selected" : ""} onClick={() => window.location.href = b[0]}>{b[1]}</button>
                    <div className="seperator"></div>
                </>
            ))}
        </div>
    );
}

export default Sidebar;