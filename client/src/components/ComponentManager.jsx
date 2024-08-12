import React, { cloneElement, useEffect, useRef, useState } from "react";
import "../styles/ComponentManager.css";
import WorkflowComponent from "./WorkflowComponent";
import { CameraZone, useCamPos, useOffset } from "./CameraZone";

function ComponentManager() {
    const [selected, setSelected] = useState(null);
    const [componentFilter, setComponentFolter] = useState("");
    const [draggingRef, setDraggingObject] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const camPos = useCamPos()
    const offset = useOffset()

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

        if(draggingRef != null){
            console.log("Dragging")
            console.log(mousePosition.x - offset[0], mousePosition.y - offset[1])
            draggingRef.current = { x:  mousePosition.x + camPos[0] - offset[0] - 50, y:  mousePosition.y + camPos[1] - offset[1] - 50 };
        }
    })

    const dragComponents = [
        {
            id: 1,
            referer: useRef([0,0]),
            component: (<div className="dragableComponent" pos={[0,0]}></div>)
        },
        {
            id: 1,
            referer: useRef([0,0]),
            component: (<div className="dragableComponent" pos={[200,200]}></div>) 
        }
    ]

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
                    {dragComponents.map((c, index) => {
                        const refElement = cloneElement(c.component, {
                            pos: [c.referer.current.x, c.referer.current.y],
                            onClick: (e) => {
                                if(draggingRef === c.referer) return setDraggingObject(null)
                                setDraggingObject(c.referer)
                            }
                        });
                        return cloneElement(refElement, { key: index });
                    })}
                </CameraZone>
            </div>
        </>
    )
}

export default ComponentManager;