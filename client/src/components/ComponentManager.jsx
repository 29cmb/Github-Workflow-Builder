import React, { cloneElement, useEffect, useState } from "react";
import "../styles/ComponentManager.css";
import "../styles/ComponentStyles.css"
import WorkflowComponent from "./WorkflowComponent";
import { CameraZone, useCamPos, useOffset } from "./CameraZone";
import collision from "../modules/collision"
import Modal from "./Modal";

function ComponentManager() {
    const [selected, setSelected] = useState(null);
    const [componentFilter, setComponentFilter] = useState("");
    const [draggingRef, setDraggingObject] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const camPos = useCamPos();
    const offset = useOffset();
    const [dragComponents, setDragComponents] = useState([]);
    const [editModalOpen, openEditModal] = useState(false);
    const [componentEditData, setComponentEditData] = useState({
        inputs: [],
        buttons: []
    });
    const [componentData, setComponentData] = useState([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const components = [
        { cid: 1, color: "red", letter: "A", name: "Action", component: (
            <div id="actionComponent">
                <p id="componentName">Action</p>
                <div className="seperator"></div>
                <p id="actionName">Action Name</p>
                <div className="seperator" style={{marginTop: `10px`}}></div>
            </div>
        ), transform: {width: 250, height: 175}, data: [
            {id: "actionName", dataIndex: "actionName", default: "Action Name"}
        ] },
        { cid: 2, color: "orange", letter: "C", name: "Command", component: (
            <div id="commandComponent">
                <p id="componentName">Command</p>
                <div className="seperator"></div>
                <p id="commandName">Linux Command Data<br/>Linux Command Data<br/>Linux Command Data</p>
                <div className="seperator" style={{marginTop: `10px`}}></div>
            </div>
        ), transform: {width: 250, height: 220}, data: [
            {id: "commandName", dataIndex: "commandName", default: "Command Name"}
        ] },
        { cid: 3, color: "#EBFF00", letter: "U", name: "Upload", component: (
            <div id="uploadComponent">
                <p id="componentName">Upload</p>
                <div className="seperator"></div>
                <p id="uploadRules">*.exe<br/>*.dll<br/>*.sys</p>
                <div className="seperator" style={{marginTop: `10px`}}></div>
            </div>
        ), transform: {width: 250, height: 220}, data: [
            {id: "uploadRules", dataIndex: "uploadRules", default: "*exe"}
        ] },
        { cid: 4, color: "lime", letter: "N", name: "NodeJS", component: (
            <div id="nodeComponent">
                <p id="componentName">Setup NodeJS</p>
                <div className="seperator"></div>
                <p id="version">v20</p>
                <div className="seperator" style={{marginTop: `10px`}}></div>
            </div>
        ), transform: {width: 250, height: 175}, data: [
            {id: "version", dataIndex: "version", default: "v20"}
        ] },
        { cid: 5, color: "gray", letter: "D", name: "Download", component: (
            <div id="downloadComponent">
                <p id="componentName">Download Artifact</p>
                <div className="seperator"></div>
                <p id="artifactName">Artifact Name</p>
                <div className="seperator" style={{marginTop: `10px`}}></div>
            </div>
        ), transform: {width: 300, height: 175}, data: [
            {id: "artifactName", dataIndex: "artifactName", default: "Artifact Name"}
        ]},
        { cid: 6, color: "#2da1ff", letter: "P", name: "Python", component: (
            <div id="pythonComponent">
                <p id="componentName">Setup Python</p>
                <div className="seperator"></div>
                <p id="pythonVersion">Version</p>
                <div className="seperator" style={{marginTop: `10px`}}></div>
            </div>
        ), transform: {width: 250, height: 175}, data: [
            {id: "pythonVersion", dataIndex: "pythonVersion", default: "v3.12"}
        ] }
    ];

    const keybinds = [
        { key: "Backspace", action: () => {
            if(editModalOpen) return;
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

                const cData = componentData.filter((c) => 
                    overlappingDragComponents.some((dragComponent) => c.id === `${dragComponent.cid}-${dragComponent.id}`)
                )

                setComponentData((prevComponents) => {
                    return prevComponents.filter((c) => {
                        return cData.some((oc) => {return oc !== c})
                    })
                })
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
            setTimeout(() => {
                if(editModalOpen) return;
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

                        var fields = {}
                        component.data.forEach((instruction) => {
                            console.log(instruction, fields)
                            if(instruction.id === undefined || instruction.default === undefined) return;
                            fields[instruction.id] = instruction.default;
                        })

                        setComponentData((prevComponents) => [
                            ...prevComponents,
                            {
                                id: `${component.cid}-${prevComponents.length + 1}`,
                                ...fields
                            }
                        ])
                    }
                }
            }, 200)
            
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

    useEffect(() => {
        // eslint-disable-next-line array-callback-return
        dragComponents.map((c) => {
            const component = components.find((component) => component.cid === c.cid);
            if(component === undefined) return null;

            component.data.forEach((instruction) => {
                const element = document.querySelector(`.placedWorkflowComponent-${c.cid}-${c.id} #${instruction.id}`);
                if(element === undefined) return;
                const d = componentData.find(comp => comp.id === `${c.cid}-${c.id}`)
                if(d === undefined || d[[instruction.dataIndex]] === undefined){
                    element.innerHTML = "Unknown"
                    return;
                };

                element.innerHTML = d[instruction.dataIndex]
            })
        })
    })

    return (
        <>
           {editModalOpen && <Modal
                title="Edit Component"
                inputs={componentEditData.inputs}
                buttons={[...componentEditData.buttons,
                    { text: "Submit", style: "submit", sendArgs: true, submit: (...params) => {
                        openEditModal(false)
                        const component = components.find((c) => c.cid === componentEditData.cid);
                        
                        const updatedComponentData = componentData.map((c) => {
                            if (c.id === `${componentEditData.cid}-${componentEditData.id}`) {
                                params.forEach((param, index) => {
                                    if(param === undefined || param === null || param === "") param = component.data[index].default;
                                    c[component.data[index].dataIndex] = param;
                                });
                            }
                            return c;
                        });
                        
                        setComponentData(updatedComponentData);
                    } },
                    { text: "Cancel", style: "cancel", submit: () => {
                        openEditModal(false)
                    }},
                ]}
            ></Modal>}
            <div id="component-sidebar">
                <div id="topButtons">
                    <button id="export">Export</button>
                    <button id="settings"><i className="fas fa-cog"></i></button>
                </div>
                <button id="connect">Connect</button>
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
                            className: `placedWorkflowComponent-${c.cid}-${c.id}`,
                            pos: c.pos,
                            onClick: (e) => {
                                if(editModalOpen) return;
                                const elementUnderMouse = document.elementFromPoint(mousePosition.x, mousePosition.y);
                                if (elementUnderMouse && elementUnderMouse.tagName.toLowerCase() === 'button') return;

                                if (draggingRef === c.id) return setDraggingObject(null);
                                setDraggingObject(c.id);
                            }
                        });

                        const inputs = components.find((component) => component.cid === c.cid).data.map((instruction) => {
                            return { id: instruction.id, type: "text", placeholder: instruction.default }
                        });

                        const button = (<button id="edit" onClick={() => {
                            setComponentEditData({
                                inputs,
                                buttons: [],
                                id: c.id,
                                cid: c.cid
                            });
                            openEditModal(true);
                        }}>Edit</button>)

                        return cloneElement(refElement, { key: index, children: [...refElement.props.children, button] });
                    })}
                </CameraZone>
            </div>
        </>
    );
}

export default ComponentManager;