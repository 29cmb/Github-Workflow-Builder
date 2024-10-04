import { useEffect } from "react";
import Topbar from "../../components/Topbar";
import "../../styles/EditPage.css"
import ComponentManager from "../../components/ComponentManager";
import { useParams } from "react-router-dom";

function EditPage() {
    
    const { pid } = useParams()
    console.log(pid)

    useEffect(() => {
        window.addEventListener('beforeunload', (event) => {
            event.preventDefault()
            event.returnValue = ''
        })
    }, [])
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
            <ComponentManager pid={parseInt(pid)}/>
        </>
    );
}

export default EditPage;