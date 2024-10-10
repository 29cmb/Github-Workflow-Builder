import { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import "../../styles/EditPage.css"
import ComponentManager from "../../components/ComponentManager";
import { useParams } from "react-router-dom";

function EditPage() {
    
    const { pid } = useParams()

    const [projectUpToDate, setProjectUpToDate] = useState(null)

    useEffect(() => {
        fetch(`/api/v1/projects/${pid}/get`)
            .then(res => res.json())
            .then(data => {
                if(data.success){
                        fetch("/api/v1/schema").then(res => res.json()).then(schema => {
                            if(data.project.projectSchemaVersion !== schema.projectSchemaVersion){
                                setProjectUpToDate(false)
                                setTimeout(() => {
                                    fetch("/api/v1/migrate", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({ pid: parseInt(pid) })
                                    }).then(res => res.json()).then(migrationData => {
                                        if(migrationData.success){
                                            setTimeout(() => {
                                                window.location.reload()
                                            }, 500)
                                        } else {
                                            console.error(migrationData.message)
                                        }
                                    })
                                }, 3000)
                            } else {
                                setProjectUpToDate(true)
                            }
                        })
                } else {
                    console.error(data.message)
                }
            })
    }, [pid])

    return (
        <>
            <Topbar buttons={[
                ["/dashboard", "Dashboard", false, true]
            ]} />
            <div id="unsupported">
                <div id="unsupportedContainer">
                    <h1>Uh oh!</h1>
                    <p>The workflow builder is currently under construction for mobile devices (any screen size under 750px)! This feature should be ready for use in sometime in the future!</p>   
                </div>
            </div>
            {projectUpToDate === false ? 
                <div id="migration">
                    <h1>This project is not up to date!</h1>
                    <p>The github workflow builder appears to have gone though some changes. Please wait for the project to migrate to the latest version.</p>
                    <p>The page will refresh once the migration has finished.</p>
                </div>
            : null}
            {projectUpToDate === true ? <ComponentManager pid={parseInt(pid)}/> : null}
        </>
    );
}

export default EditPage;