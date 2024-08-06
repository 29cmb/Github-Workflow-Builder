import React from "react";
import "../styles/Sidebar.css";

function Sidebar({ buttons }) {
    return (
        <div id="sidebar">
            {buttons.map((b, index) => (
                <>
                    <button key={index} id="sidebarButton" className={b[2] ? "selected" : ""} onClick={() => window.location.href = b[0]}>{b[1]}</button>
                    <div className="seperator"></div>
                </>
            ))}
            <button id="logout" onClick={() => {
                fetch("/api/v1/user/logout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(r => r.json()).then(d => {
                    if(d.success === true){
                        window.location.href = "/login"
                    } else {
                        console.log(d.message)
                    }
                })
            }}>Logout</button>
        </div>
    );
}

export default Sidebar;