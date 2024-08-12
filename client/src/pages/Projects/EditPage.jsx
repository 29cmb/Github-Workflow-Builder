import React from "react";
import Topbar from "../../components/Topbar";
import "../../styles/EditPage.css"
import ComponentManager from "../../components/ComponentManager";

function EditPage() {
    return (
        <>
            <Topbar buttons={[
                ["/dashboard", "Dashboard", false, true]
            ]} />
            <ComponentManager/>
        </>
    );
}

export default EditPage;