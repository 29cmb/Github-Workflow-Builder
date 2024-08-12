import React from "react";
import "../styles/WorkflowComponent.css";

function WorkflowComponent({ color, letter, onClick, selected }) {
    return (
        <div id="workflowComponent" className={selected && "selected"}>
            <button onClick={onClick}></button>
            <div id="background" style={{backgroundColor: color}}>
                <p>{letter}</p>
            </div>
        </div>
    )
}

export default WorkflowComponent;