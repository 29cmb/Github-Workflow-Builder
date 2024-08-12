import React, { useState } from "react";
import "../styles/ComponentSidebar.css";
import WorkflowComponent from "./WorkflowComponent";

function ComponentSidebar() {
    const [selected, setSelected] = useState(null);

    const components = [
        {color: "red", letter: "A"},
        {color: "orange", letter: "C"},
        {color: "#EBFF00", letter: "U"}
    ]

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
                    {components.map((component, index) => (
                        <WorkflowComponent key={index} color={component.color} letter={component.letter} onClick={() => {
                            if(selected === component.color + component.letter) return setSelected(null)
                            setSelected(component.color + component.letter)
                        }} selected={selected === component.color + component.letter}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ComponentSidebar;