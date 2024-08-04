import React from "react";
import "../styles/Topbar.css";

function topbar(){
    return (
        <div id="topbar">
            <button onClick={() => {window.location.href = '/login'}} id="topbarBtn">Login</button>
        </div>
    )
}

export default topbar;