import React from "react";
import "../styles/ComponentSidebar.css";
import WorkflowComponent from "./WorkflowComponent";

function ComponentSidebar() {
    return( 
        <div id="component-sidebar">
            <div id="topButtons">
                <button id="export">Export</button><button id="settings"><i className="fas fa-cog"></i></button>
            </div>
            <div id="components">
                <div id="search">
                    <i className="fas fa-search search-icon"></i>
                    <input type="text" placeholder="Search..."/>
                </div>
                <div id="component-container">
                    <WorkflowComponent color="red" letter="A"/>
                    <WorkflowComponent color="orange" letter="C"/>
                    <WorkflowComponent color="#EBFF00" letter="U"/>
                </div>
            </div>
        </div>
    )
}

export default ComponentSidebar;