import React from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import "../../styles/Projects.css";
import Project from "../../components/Project";

function Projects() {
    return (
        <>
            <Topbar buttons={[
                ["/", "Home", false]
            ]}>
            </Topbar>
            <Sidebar buttons={[
                ["/", "Projects", true],
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