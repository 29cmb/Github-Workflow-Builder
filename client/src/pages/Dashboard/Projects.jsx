import React, { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import "../../styles/Projects.css";
import Project from "../../components/Project";
import Modal from "../../components/Modal";

function Projects() {
    const getProjects = async () => {
        try {
            const response = await fetch("/api/v1/user/projects/get", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Failed to fetch projects:", error);
            return [];
        }
    };

    const [projects, setProjects] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        getProjects().then(data => {
            if (data.projects) {
                setProjects(data.projects);
            }
        }).catch(error => console.error("Error setting projects:", error));
    }, []);

    return (
        <>
            <Topbar buttons={[
                ["/", "Home", false]
            ]}>
            </Topbar>
            <Sidebar buttons={[
                ["/dashboard", "Projects", true],
                ["/", "Teams", false],
                ["/", "Account", false]
            ]}></Sidebar>
            {modalVisible ? <Modal
                title="Create Project"
                inputs={[
                    {id: "projectName", type: "text", placeholder: "Project Name"},
                    {id: "projectDesc", type: "text", placeholder: "Project Description"},
                ]}
                button={["Create", (pName, pDesc) => {
                    console.log("is he creating right now!??!!??!!!!?!?!?!??!?!?", pName, pDesc)
                }]}
            ></Modal> : null}
            <div id="projects">
                {
                    projects.map(project => (
                        <Project key={project.id} name={project.name} owner={{name: project.creator.name, type: project.creator.type}} />
                    ))
                }
            </div>
        </>
    );
}

export default Projects;