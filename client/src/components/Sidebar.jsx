import { useState } from "react";
import "../styles/Sidebar.css";

function Sidebar({ buttons }) {
    const [sidebarHidden, hideSidebar] = useState(true)
    return (
        <div id="sidebar" className={sidebarHidden === true ? "hidden": ""}>
            {buttons.map((b, index) => (
                <>
                    <button key={index} id="sidebarButton" className={`${b[2] ? "selected" : ""}${sidebarHidden === true ? " hidden": ""}`} onClick={() => window.location.href = b[0]}>{b[1]}</button>
                    <div className={`${sidebarHidden === true ? 'hidden' : ""} seperator`}/>
                </>
            ))}
            <button className={sidebarHidden === true ? "hidden": ""} id="logout" onClick={() => {
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
            <button id="toggle" className={sidebarHidden === true ? "hidden": ""} onClick={() => {
                hideSidebar(!sidebarHidden)
            }}>
                <img alt="Toggle sidebar" src="/assets/arrow.png"></img>
            </button>
        </div>
    );
}

export default Sidebar;