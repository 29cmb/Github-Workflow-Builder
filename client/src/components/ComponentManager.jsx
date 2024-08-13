import React, { cloneElement, useEffect, useState } from "react";
import "../styles/ComponentManager.css";
import "../styles/ComponentStyles.css"
import WorkflowComponent from "./WorkflowComponent";
import { CameraZone, useCamPos, useOffset } from "./CameraZone";
import collision from "../modules/collision"

function ComponentManager() {
    const [selected, setSelected] = useState(null);
    const [componentFilter, setComponentFilter] = useState("");
    const [draggingRef, setDraggingObject] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const camPos = useCamPos();
    const offset = useOffset();
    const [dragComponents, setDragComponents] = useState([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const components = [
        { cid: 1, color: "red", letter: "A", name: "Action", component: (
            <div id="actionComponent">
                <p id="componentName">Action</p>
                <div class="seperator"></div>
                <p id="actionName">Action Name</p>
                <div class="seperator" style={{marginTop: `10px`}}></div>
                <button id="edit">Edit</button>
            </div>
        ), transform: {width: 250, height: 175} },
        { cid: 2, color: "orange", letter: "C", name: "Command", component: (
            <div id="commandComponent"></div>
        ), transform: {width: 250, height: 175} },
        { cid: 3, color: "#EBFF00", letter: "U", name: "Upload", component: (
            <div id="uploadComponent"></div>
        ), transform: {width: 250, height: 175} }
    ];

    const keybinds = [
        { key: "Backspace", action: () => {
            const overlappingDragComponents = dragComponents.filter((dragComponent) => {
                const matchingComponents = components.filter((component) => component.cid === dragComponent.cid);
                if (matchingComponents.length === 0) return false;
            
                return matchingComponents.some((component) => {
                    const [x, y] = dragComponent.pos;
                    return collision(
                        mousePosition.x + camPos[0] - offset[0], 
                        mousePosition.y + camPos[1] - offset[1],
                        1,
                        1,
                        x, 
                        y, 
                        component.transform.width, 
                        component.transform.height
                    );
                });
            });
            
            if (overlappingDragComponents.length > 0) {
                setDragComponents((prevComponents) =>
                    prevComponents.filter((c) => {
                        return overlappingDragComponents.some((oc) => {return oc !== c});
                    })
                );
            }
        }}
    ]

    const filteredComponents = components.filter((component) => {
        if (componentFilter.length < 2) return true;
        return component.name.toLowerCase().includes(componentFilter.toLowerCase());
    });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseDown = (e) => {
            if (e.button === 0) {
                if (selected !== null) {
                    const overlappingDragComponents = dragComponents.filter((dragComponent) => {
                        const matchingComponents = components.filter((component) => component.cid === dragComponent.cid);
                        if (matchingComponents.length === 0) return false;
                    
                        return matchingComponents.some((component) => {
                            const [x, y] = dragComponent.pos;
                            return collision(
                                mousePosition.x + camPos[0] - offset[0], 
                                mousePosition.y + camPos[1] - offset[1],
                                1,
                                1,
                                x, 
                                y, 
                                component.transform.width, 
                                component.transform.height
                            );
                        });
                    });

                    if(overlappingDragComponents.length > 0) return;
                    const component = components.find((c) => c.color + c.letter === selected);
                    setDragComponents((prevComponents) => [
                        ...prevComponents,
                        {
                            cid: component.cid,
                            id: prevComponents.length + 1,
                            pos: [
                                mousePosition.x + camPos[0] - offset[0] - 50,
                                mousePosition.y + camPos[1] - offset[1] - 50
                            ],
                            component: component.component
                        }
                    ]);
                }
            }
        };

        const handleKeydown = (e) => {
            keybinds.forEach((keybind) => {
                if (keybind.key === e.key) keybind.action();
            });
        }

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("keydown", handleKeydown);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("keydown", handleKeydown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected, components]);

    useEffect(() => {
        if (draggingRef != null) {
            setDragComponents((prevComponents) =>
                prevComponents.map((c) =>
                    c.id === draggingRef ? {
                        ...c,
                        pos: [
                            mousePosition.x + camPos[0] - offset[0] - 50,
                            mousePosition.y + camPos[1] - offset[1] - 50
                        ]
                    } : c
                )
            );
        }
    }, [mousePosition, draggingRef, camPos, offset]);

    return (
        <>
            <div id="component-sidebar">
                <div id="topButtons">
                    <button id="export">Export</button>
                    <button id="settings"><i className="fas fa-cog"></i></button>
                </div>
                <div id="components">
                    <div id="search">
                        <i className="fas fa-search search-icon"></i>
                        <input type="text" placeholder="Search..." onInputCapture={(v) => {
                            setComponentFilter(v.target.value);
                        }} />
                    </div>
                    <div id="component-container">
                        {filteredComponents.map((component, index) => (
                            <WorkflowComponent key={index} color={component.color} letter={component.letter} onClick={() => {
                                if (selected === component.color + component.letter) return setSelected(null);
                                setSelected(component.color + component.letter);
                            }} selected={selected === component.color + component.letter} />
                        ))}
                    </div>
                </div>
            </div>
            <div id="workspace-container" style={{ zIndex: 0 }}>
                <CameraZone>
                    {dragComponents.map((c, index) => {
                        const refElement = cloneElement(c.component, {
                            className: "placedWorkflowComponent",
                            pos: c.pos,
                            onClick: (e) => {
                                const elementUnderMouse = document.elementFromPoint(mousePosition.x, mousePosition.y);
                                if (elementUnderMouse && elementUnderMouse.tagName.toLowerCase() === 'button') return;

                                if (draggingRef === c.id) return setDraggingObject(null);
                                setDraggingObject(c.id);
                            }
                        });
                        return cloneElement(refElement, { key: index });
                    })}
                </CameraZone>
            </div>
        </>
    );
}

export default ComponentManager;