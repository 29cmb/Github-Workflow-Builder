import React, { useEffect, useState } from "react";
import "../styles/ComponentManager.css";
import WorkflowComponent from "./WorkflowComponent";
import { CameraZone, useCamPos } from "./CameraZone";

function ComponentManager() {
    const [selected, setSelected] = useState(null);
    const [componentFilter, setComponentFolter] = useState("");
    const [dragging, setDraggingObject] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const camPos = useCamPos()

    const components = [
        {color: "red", letter: "A", name: "Action"},
        {color: "orange", letter: "C", name: "Command"},
        {color: "#EBFF00", letter: "U", name: "Upload"}
    ]

    const filteredComponents = components.filter((component) => {
        if(componentFilter.length < 2) return true
        return component.name.toLowerCase().includes(componentFilter.toLowerCase())
    })

    useEffect(() => {
        window.addEventListener("mousemove", (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        })

        if(dragging != null){
            dragging.pos = [mousePosition.x - camPos.x, mousePosition.y - camPos.y]
        }
    })

    return(
        <>
            <div id="component-sidebar">
                <div id="topButtons">
                    <button id="export">Export</button><button id="settings"><i className="fas fa-cog"></i></button>
                </div>
                <div id="components">
                    <div id="search">
                        <i className="fas fa-search search-icon"></i>
                        <input type="text" placeholder="Search..." onInputCapture={(v) => {
                            setComponentFolter(v.target.value)
                        }}/>
                    </div>
                    <div id="component-container">
                        {filteredComponents.map((component, index) => (
                            <WorkflowComponent key={index} color={component.color} letter={component.letter} onClick={() => {
                                if(selected === component.color + component.letter) return setSelected(null)
                                setSelected(component.color + component.letter)
                            }} selected={selected === component.color + component.letter}/>
                        ))}
                    </div>
                </div>
            </div>
            <div id="workspace-container" style={{zIndex: 0}}>
                <CameraZone>
                    <div className="dragableComponent" pos={[0,0]} onClick={(e) => {
                        setDraggingObject(e.currentTarget)
                    }}></div>
                </CameraZone>
            </div>
        </>
    )
}

export default ComponentManager;