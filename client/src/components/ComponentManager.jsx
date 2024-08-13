import React, { cloneElement, useEffect, useState } from "react";
import "../styles/ComponentManager.css";
import WorkflowComponent from "./WorkflowComponent";
import { CameraZone, useCamPos, useOffset } from "./CameraZone";

function ComponentManager() {
    const [selected, setSelected] = useState(null);
    const [componentFilter, setComponentFilter] = useState("");
    const [draggingRef, setDraggingObject] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const camPos = useCamPos();
    const offset = useOffset();
    const [dragComponents, setDragComponents] = useState([
        {
            id: 1,
            pos: [0, 0],
            component: (<div className="dragableComponent" pos={[0, 0]}></div>)
        },
        {
            id: 2,
            pos: [200, 200],
            component: (<div className="dragableComponent" pos={[200, 200]}></div>)
        }
    ]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const components = [
        { color: "red", letter: "A", name: "Action", component: (
            <div id="actionComponent"></div>
        ) },
        { color: "orange", letter: "C", name: "Command" },
        { color: "#EBFF00", letter: "U", name: "Upload" }
    ];

    const filteredComponents = components.filter((component) => {
        if (componentFilter.length < 2) return true;
        return component.name.toLowerCase().includes(componentFilter.toLowerCase());
    });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseDown = (e) => {
            if (selected !== null) {
                const component = components.find((c) => c.color + c.letter === selected);
                setDragComponents((prevComponents) => [
                    ...prevComponents,
                    {
                        id: prevComponents.length + 1,
                        pos: [e.clientX, e.clientY],
                        component: component.component
                    }
                ]);
                setSelected(null);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);
        };
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
            <div id="workspace-container" style={{ zIndex: 0 }} onClick={() => {
                if(selected !== null){
                    setDragComponents((prevComponents) => [
                        ...prevComponents,
                        {
                            id: prevComponents.length + 1,
                            pos: [
                                mousePosition.x + camPos[0] - offset[0] - 50,
                                mousePosition.y + camPos[1] - offset[1] - 50
                            ],
                            component: components.find((c) => c.color + c.letter === selected).component
                        }
                    ])
                }
            }}>
                <CameraZone>
                    {dragComponents.map((c, index) => {
                        const refElement = cloneElement(c.component, {
                            pos: c.pos,
                            onClick: (e) => {
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