import { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import ViewPanel from "../../components/ViewPanel";

function ViewPage({ id }){
    const [projectUpToDate, setProjectUpToDate] = useState(null)

    useEffect(() => {
        fetch(`/api/v1/projects/${id}/get`)
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
                                        body: JSON.stringify({ pid: parseInt(id) })
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
    }, [id])
    return (
        <>
            <Topbar buttons={[
                ["/gallery", "Gallery", false],
                ["/login", "Login", false, false],
                ["/dashboard", "Dashboard", false, true]
            ]} />
            {projectUpToDate === false && 
                <div>
                    <h1>This project is out of date!</h1>
                    <p>The github workflow builder appears to have gone though some changes. Please wait for the project to migrate to the latest version.</p>
                    <p>The page will refresh once the migration has finished.</p>
                </div>
            }
            {projectUpToDate && <ViewPanel pid={id}/>}
        </>
    )
}

export default ViewPage;