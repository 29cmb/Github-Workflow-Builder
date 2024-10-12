import Topbar from "../../components/Topbar";
import "../../styles/Gallery.css"
import Project from "../../components/Project"
import { useEffect, useState } from "react";

function ProjectGallery(){
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("/api/v1/gallery").then(res => res.json()).then(data => {
            if(data.success){
                setProjects(data.projects)
            } else {
                console.error("Failed to fetch projects:", data)
            }
        }).catch(error => console.error("Failed to fetch projects:", error))
    }, [])

    const filteredProjects = projects.filter(project => {
        if (search.length < 2) return true;
        return project.name.toLowerCase().includes(search.toLowerCase());
    });


    return <>
        <Topbar buttons={[
            ["/", "Home", false],
            ["/login", "Login", true, false],
            ["/dashboard", "Dashboard", true, true]
        ]} />
        <div id="gallery">
            <div id="search">
                <i className="fas fa-search search-icon" />
                <input type="text" placeholder="Search..." onInputCapture={(v) => {
                    setSearch(v.target.value)
                }} />
            </div>
            <div id="galleryContainer">
                {filteredProjects.map((project, i) => {
                    return <Project
                        key={project.pid}
                        id={project.pid}
                        name={project.name}
                        description={project.description}
                        owner={{ name: project.creator.name, type: project.creator.type }}
                        gallery={true}
                    />
                })}
            </div>
        </div>
        
    </>
}

export default ProjectGallery;