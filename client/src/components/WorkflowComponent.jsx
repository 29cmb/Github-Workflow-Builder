import React from "react";
import "../styles/WorkflowComponent.css";

function WorkflowComponent({ color, letter }) {
    return (
        <div id="workflowComponent">
            <div id="background" style={{backgroundColor: color}}>
                <p>{letter}</p>
            </div>
        </div>
    )
}

export default WorkflowComponent;