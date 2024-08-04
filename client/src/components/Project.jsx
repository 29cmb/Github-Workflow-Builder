import React from "react";
import "../styles/Project.css";

function Project({ name, owner }) {
    return (
        <div className="project">
            <img src="/assets/Placeholder.png" alt="Project"></img>
            <p id="name">{name}</p>
            <p id="owner">Owned by: <span className={owner.type}>{owner.name}</span></p>
            <button id="open">Open</button>
        </div>
    )
}

export default Project;