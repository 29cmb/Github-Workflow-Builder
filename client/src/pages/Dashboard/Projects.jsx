import React, { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import "../../styles/Projects.css";
import Project from "../../components/Project";

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

    useEffect(() => {
        getProjects().then(data => {
            if (data.projects) {
                setProjects(data.projects);
            }
        }).catch(error => console.error("Error setting projects:", error));
    }, []);

    const getUserFromID = async (uid) => {
        try {
            const response = await fetch("/api/v1/user/get", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    uid
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Failed to fetch user:", error);
            return {};
        }
    };

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
            <div id="projects">
                {
                    projects.map(project => (
                        <Project key={project.id} name={project.name} owner={project.creator} />
                    ))
                }
            </div>
        </>
    );
}

export default Projects;