import { cloneElement, useEffect, useState } from "react";
import "../styles/ComponentManager.css";
import "../styles/ComponentStyles.css"
import WorkflowComponent from "./WorkflowComponent";
import { CameraZone, useCamPos, useOffset } from "react-camframe";
import collision from "../modules/collision"
import Modal from "./Modal";
import Export from "./Export";
import {Toaster, toast} from "react-hot-toast"
import DottedLine from "./DottedLine";

function ComponentManager({ pid }) {
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
    const [connectingData, setConnectingData] = useState({
        active: false,
        stage: "from",
        from: null,
        to: null
    })
    const [projectData, setProjectData] = useState({ name: "Workflow" });
    const [isDirty, setDirty] = useState(false);

    const components = [
        { cid: 1, color: "red", letter: "A", name: "Action", component: (
            <div className="actionComponent">
                <p id="componentName">Action</p>
                <div className="seperator" />
                <p id="actionName">Action Name</p>
                <div className="seperator" style={{marginTop: "10px"}} />
            </div>
        ), transform: {width: 250, height: 175}, data: [
            {id: "actionName", dataIndex: "actionName", default: "Action Name"}
        ], route: "from" },
        { cid: 2, color: "orange", letter: "C", name: "Command", component: (
            <div className="commandComponent">
                <p id="componentName">Command</p>
                <div className="seperator" />
                <p id="commandName">Linux Command Data<br/>Linux Command Data<br/>Linux Command Data</p>
                <div className="seperator" style={{marginTop: "10px"}} />
            </div>
        ), transform: {width: 250, height: 220}, data: [
            {id: "commandName", dataIndex: "commandName", default: "echo Hello World!"}
        ], route: "to" },
        { cid: 3, color: "#EBFF00", letter: "U", name: "Upload", component: (
            <div className="uploadComponent">
                <p id="componentName">Upload</p>
                <div className="seperator" />
                <p id="uploadRules">*.exe<br/>*.dll<br/>*.sys</p>
                <div className="seperator" style={{marginTop: "10px"}} />
            </div>
        ), transform: {width: 250, height: 220}, data: [
            {id: "uploadRules", dataIndex: "uploadRules", default: "*exe"}
        ], route: "to" },
        { cid: 4, color: "lime", letter: "N", name: "NodeJS", component: (
            <div className="nodeComponent">
                <p id="componentName">Setup NodeJS</p>
                <div className="seperator" />
                <p id="version">v20</p>
                <div className="seperator" style={{marginTop: "10px"}} />
            </div>
        ), transform: {width: 250, height: 175}, data: [
            {id: "version", dataIndex: "version", default: "v20"}
        ], route: "to" },
        { cid: 5, color: "gray", letter: "D", name: "Download", component: (
            <div className="downloadComponent">
                <p id="componentName">Download Artifact</p>
                <div className="seperator" />
                <p id="artifactName">Artifact Name</p>
                <div className="seperator" style={{marginTop: "10px"}} />
            </div>
        ), transform: {width: 300, height: 175}, data: [
            {id: "artifactName", dataIndex: "artifactName", default: "Artifact Name"}
        ], route: "to" },
        { cid: 6, color: "#2da1ff", letter: "P", name: "Python", component: (
            <div className="pythonComponent">
                <p id="componentName">Setup Python</p>
                <div className="seperator" />
                <p id="pythonVersion">Version</p>
                <div className="seperator" style={{marginTop: "10px"}} />
            </div>
        ), transform: {width: 250, height: 175}, data: [
            {id: "pythonVersion", dataIndex: "pythonVersion", default: "v3.12"}
        ], route: "to" },
        { cid: 7, color: "#f89820", letter: "J", name: "Java", component: (
            <div className="javaComponent">
                <p id="componentName">Setup Java <p id="distro">(temurin)</p></p>
                <div className="seperator" />
                <p id="javaVersion">Version</p>
                <div className="seperator" style={{marginTop: "10px"}} />
            </div>
        ), transform: {width: 250, height: 175}, data: [
            {id: "javaVersion", dataIndex: "javaVersion", default: "v21"}
        ], route: "to" }
    ];
    const [exportVisible, setExportVisible] = useState(false);
    useEffect(() => {
        fetch(`/api/v1/projects/${pid}/get`)
            .then(response => response.json())
            .then(data => {
                if (data.success === true) {
                    var existingComponentData = data.project.data.componentData;
                    setComponentData(existingComponentData);
                    setProjectData(data.project);
    
                    const newDragComponents = data.project.data.componentData.map((c) => {
                        const component = components.find((component) => component.cid === c.cid);
                        if (component === undefined) return null;
                        return {
                            cid: component.cid,
                            id: c.dcid,
                            pos: c.pos,
                            component: component.component
                        };
                    }).filter(c => c !== null);
    
                    setDragComponents(newDragComponents);
                } else {
                    toast(`There was an error while fetching project data: ${data.message}`, {
                        icon: "❌",
                        style: {
                            color: "white",
                            backgroundColor: "#333",
                            borderRadius: "10px",
                            maxWidth: "60%",
                        }
                    });
                }
            });
    // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (isDirty) {
                event.preventDefault();
                event.returnValue = '';
            }
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isDirty]);

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

                setDirty(true)
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
                if(editModalOpen || exportVisible) return;
                if(connectingData.active) return;
                if (e.button === 0) {
                    if (selected !== null) {
                        const elementUnderMouse = document.elementFromPoint(mousePosition.x, mousePosition.y);
                        if (elementUnderMouse && elementUnderMouse.tagName.toLowerCase() === 'button') return;

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
                        setDirty(true)
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
                            if(instruction.id === undefined || instruction.default === undefined) return;
                            fields[instruction.id] = instruction.default;
                        })

                        setComponentData((prevComponents) => [
                            ...prevComponents,
                            {
                                cid: component.cid,
                                id: `${component.cid}-${prevComponents.length + 1}`,
                                dcid: prevComponents.length + 1,
                                routes: [],
                                pos: [
                                    mousePosition.x + camPos[0] - offset[0] - 50,
                                    mousePosition.y + camPos[1] - offset[1] - 50
                                ],
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
        if (draggingRef !== null) {
            if(connectingData.active){ 
                setDraggingObject(null);
                return; 
            }

            setDirty(true)
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

            setComponentData((prevComponents) => 
                prevComponents.map((c) => {
                    const dCompon = dragComponents.find((c) => c.id === draggingRef)
                    if(c === undefined || c.id === undefined || dCompon === undefined || dCompon.cid === undefined) return null;
                    if(c.id === `${dCompon.cid}-${draggingRef}`){
                        return {
                            ...c,
                            pos: [
                                mousePosition.x + camPos[0] - offset[0] - 50,
                                mousePosition.y + camPos[1] - offset[1] - 50
                            ]
                        }
                    }
                    return c;
                })
            )
        }
    // eslint-disable-next-line
    }, [mousePosition, draggingRef, camPos, offset, connectingData]);

    useEffect(() => {
        dragComponents.forEach((c) => {
            if(c === undefined || c.cid === undefined) return;
            const component = components.find((component) => component.cid === c.cid);
            if(component === undefined) return null;

            component.data.forEach((instruction) => {
                try {
                    const element = document.querySelector(`#placedWorkflowComponent-${c.cid}-${c.id} #${instruction.id}`);
                    if(element === undefined || c === undefined || c.cid === undefined || c.id === undefined) return;
                    const d = componentData.find(comp => comp.id === `${c.cid}-${c.id}`)
                    if(d === undefined || d[[instruction.dataIndex]] === undefined){
                        element.innerHTML = "Unknown"
                        return;
                    };

                    element.innerHTML = d[instruction.dataIndex]
                } catch(e){}
            })

            return;
        })
    })

    return (
        <>
            <Toaster/>
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
             />}
            {exportVisible && <Export
                projectData={projectData}
                componentData={componentData}
                setVisible={setExportVisible}
            />}
            <div id="component-sidebar">
                <div id="topButtons">
                    <button id="export" onClick={() => setExportVisible(true)}>Export</button>
                    <button id="save" onClick={() => {
                        toast("Saving...", {
                            icon: "📝",
                            style: {
                                color: "white",
                                backgroundColor: "#333",
                                borderRadius: "10px",
                                maxWidth: "60%",
                            }
                        });
                        fetch("/api/v1/projects/save", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                pid,
                                data: {
                                    componentData
                                }
                            })
                        }).then(response => response.json()).then(data => {
                            if(data.success === true){
                                setDirty(false)
                                toast("Saved successfully!", {
                                    icon: "✅",
                                    style: {
                                        color: "white",
                                        backgroundColor: "#333",
                                        borderRadius: "10px",
                                        maxWidth: "60%",
                                    }
                                });
                            } else {
                                toast(`There was an error while saving: ${data.message}`, {
                                    icon: "❌",
                                    style: {
                                        color: "white",
                                        backgroundColor: "#333",
                                        borderRadius: "10px",
                                        maxWidth: "60%",
                                    }
                                });
                            }
                        })
                    }}><i className="fas fa-save" /></button>
                </div>
                {!connectingData.active ? <button id="connect" onClick={() => setConnectingData(() => {
                    return {
                        active: true,
                        stage: "from",
                        from: null,
                        to: null
                    }
                })}>Connect</button> : <button id="stopConnecting" onClick={() => setConnectingData(() => {
                    return {
                        active: false,
                        stage: "from",
                        from: null,
                        to: null
                    }
                })}>Exit Connect</button>}
                <div id="components">
                    <div id="search">
                        <i className="fas fa-search search-icon" />
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
                {componentData.map((c, index) => {
                    if(!c.routes || !Array.isArray(c.routes)) return null;
                    return c.routes.map((route, routeIndex) => {
                        if (route.type !== "to") return null;
                
                        const fromComponent = document.getElementById(`placedWorkflowComponent-${c.id}`);
                        if (!fromComponent) return null;
                
                        const toComponent = document.getElementById(`placedWorkflowComponent-${route.id}`);
                        if (!toComponent) return null;
                
                        const start = {
                            x: fromComponent.getBoundingClientRect().left + fromComponent.getBoundingClientRect().width / 2,
                            y: fromComponent.getBoundingClientRect().top + fromComponent.getBoundingClientRect().height / 2
                        };
                
                        const end = {
                            x: toComponent.getBoundingClientRect().left + toComponent.getBoundingClientRect().width / 2,
                            y: toComponent.getBoundingClientRect().top + toComponent.getBoundingClientRect().height / 2
                        };
                
                        return <DottedLine key={`${index}-${routeIndex}`} start={start} end={end} />;
                    });
                })}
                <CameraZone positionStyles={{ color: "white", zIndex: 100, position: "absolute", top: '70px', left: '430px' }}>
                    {dragComponents.map((c, index) => {
                        const component = components.find((component) => component.cid === c.cid)

                        const refElement = cloneElement(c.component, {
                            id: `placedWorkflowComponent-${c.cid}-${c.id}`,
                            className: `${c.component.props.className}${connectingData.active ? (component.route !== connectingData.stage ? " dimmed" : "") : ""}`,
                            pos: c.pos,
                            onClick: () => {
                                if(connectingData.active){
                                    if(connectingData.stage === component.route){
                                        if(connectingData.stage !== "to"){
                                            setConnectingData(() => {
                                                return {
                                                    active: true,
                                                    stage: "to",
                                                    from: c,
                                                    to: null
                                                }
                                            })
                                        } else {
                                            const fromComponent = components.find((component) => component.cid === connectingData.from.cid);
                                            if(fromComponent.route !== "from") return;
                                            if(component.route !== "to") return;
                                            
                                            setDirty(true)
                                            setComponentData((previous) => {
                                                return previous.map((pC) => {
                                                    if(pC.id === `${fromComponent.cid}-${connectingData.from.id}`){
                                                        if (!pC.routes.some(route => route.id === `${component.cid}-${c.id}`)) {
                                                            pC.routes.push({ id: `${component.cid}-${c.id}`, type: "from" });
                                                        }
                                                    }

                                                    if(pC.id === `${component.cid}-${c.id}`){
                                                        if(!pC.routes.some(route => route.id === `${fromComponent.cid}-${connectingData.from.id}`)){
                                                            pC.routes.push({id: `${fromComponent.cid}-${connectingData.from.id}`, type: "to"});
                                                        }
                                                    }

                                                    return pC;
                                                })
                                            })
                                            setConnectingData({ active: false, stage: "from", from: null, to: null });
                                        }
                                    }
                                    return;
                                }
                                if(editModalOpen || exportVisible) return;
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
                            if(connectingData.active) return;
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