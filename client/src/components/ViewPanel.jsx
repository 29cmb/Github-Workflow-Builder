import "../styles/ViewPanel.css"
import Components from "../Components"
import { CameraZone } from "react-camframe"
import { cloneElement, useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Export from "./Export";

function ViewPanel({ pid }){
    const [componentData, setComponentData] = useState([]);
    const [projectData, setProjectData] = useState({ name: "Project Name", description: "This is the description" });
    const [exportPanelOpen, openExportPanel] = useState(false);
    useEffect(() => {
        fetch(`/api/v1/projects/${pid}/get`)
            .then(response => response.json())
            .then(data => {
                if (data.success === true) {
                    var existingComponentData = data.project.data.componentData;
                    setComponentData(existingComponentData);
                    setProjectData(data.project);
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
        componentData.forEach((c) => {
            if(c === undefined || c.cid === undefined) return;
            const component = Components.find((component) => component.cid === c.cid);
            if(component === undefined) return null;

            component.data.forEach((instruction) => {
                try {
                    const element = document.querySelector(`.placedWorkflowComponent-${c.cid}-${c.id} #${instruction.id}`);
                    if(element === undefined || c === undefined || c.cid === undefined || c.id === undefined) return;
                    if(c[[instruction.dataIndex]] === undefined){
                        element.innerHTML = "Unknown"
                        return;
                    };

                    element.innerHTML = c[instruction.dataIndex]
                } catch(e){}
            })

            return;
        })
    })

    return (
        <>
            <Toaster />
            <div id="viewPanel">
                <div id="viewContainer">
                    <div id="projectContent">
                        <CameraZone>
                            {componentData.map((c, index) => {
                                const component = Components.find((component) => component.cid === c.cid)
                                if(!component || !component.component) return <></>;

                                const refElement = cloneElement(component.component, {
                                    className: `placedWorkflowComponent-${c.cid}-${c.id}`,
                                    pos: c.pos,
                                })

                                return refElement
                            })}
                        </CameraZone>
                    </div>
                    <div id="bottomBar">
                        <p id="name">{projectData.name}</p>
                        <p id="description">{projectData.description}</p>
                        <div id="exportButton">
                            <button onClick={() => {
                                openExportPanel((prev) => !prev);
                            }}>Export</button>
                        </div>
                    </div>
                </div>
            </div>
            {exportPanelOpen && <Export componentData={componentData} projectData={projectData} setVisible={openExportPanel}></Export>}
        </>
       
    )
}

export default ViewPanel