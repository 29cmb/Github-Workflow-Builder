import React from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import "../../styles/Projects.css";
import Project from "../../components/Project";

function Projects() {
    const getProjects = async () => {
        await fetch("/api/v1/user/projects/get", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        }).then(r => r.json()).then(data => {
            console.log(data)
        })
    }
    getProjects()
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
                <Project
                    name="Workflow #1"
                    owner={{name: "You", type: "user"}}
                />
                <Project
                    name="Workflow #2"
                    owner={{name: "Nibbl_z", type: "user"}}
                />
                <Project
                    name="Workflow #3"
                    owner={{name: "Funi Dog Games", type: "team"}}
                />
            </div>
        </>
    );
}

export default Projects;