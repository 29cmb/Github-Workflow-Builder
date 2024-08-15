import React, { useEffect } from "react";
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
            <ComponentManager pid={parseInt(pid)}/>
        </>
    );
}

export default EditPage;