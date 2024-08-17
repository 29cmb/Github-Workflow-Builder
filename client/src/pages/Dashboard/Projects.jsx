import React, { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import "../../styles/Projects.css";
import Project from "../../components/Project";
import Modal from "../../components/Modal";
import toast, { Toaster } from 'react-hot-toast';

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
            } else {
                console.log("error")
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
                ["/dashboard/teams", "Teams", false],
                ["/dashboard/account", "Account", false]
            ]}></Sidebar>
            <Toaster />
            {modalVisible ? <Modal
                title="Create Project"
                inputs={[
                    {id: "projectName", type: "text", placeholder: "Project Name"},
                    {id: "projectDesc", type: "text", placeholder: "Project Description"},
                ]}
                buttons={[
                    {id: "create", text: "Create", style: "submit", sendArgs: true, submit: (name, description) => {
                        setModalVisible(false);
                        toast("Creating project...", {icon: "🚀", style: {color: "white", backgroundColor: "#333", padding: "10px", borderRadius: "10px"}});
                        fetch("/api/v1/projects/new", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                name,
                                description,
                                type: "user" // TODO: Add team project creation
                            })
                        }).then(r => r.json()).then(data => {
                            if(data.success === true){
                                toast("Your project has been created successfully! Redirecting...", {
                                    icon: "✅",
                                    style: {
                                        color: "white",
                                        backgroundColor: "#333",
                                        borderRadius: "10px",
                                        maxWidth: "60%",
                                    }
                                });
                                setTimeout(() => {
                                    window.location.href = `/projects/${data.project.pid}`
                                }, 1000)
                            } else {
                                toast(`There was an error creating your project: ${data.message}`, {
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
                    }},
                    {id: "cancel", text: "Cancel", style: "cancel", submit: () => {
                        setModalVisible(false);
                    }}
                ]}
            ></Modal> : null}
            <button id="new" onClick={() => {setModalVisible(true)}}><img src="/assets/NewProject.png" alt="New"></img></button>
            <div id="projects">
                {
                    projects.map(project => (
                        <Project key={project.pid} id={project.pid} name={project.name} owner={{name: project.creator.name, type: project.creator.type}} />
                    ))
                }
            </div>
        </>
    );
}

export default Projects;