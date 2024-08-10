import React from "react";
import Topbar from "../../components/Topbar";
import "../../styles/EditPage.css"
import ComponentSidebar from "../../components/ComponentSidebar";

function EditPage() {
    return (
        <>
            <Topbar buttons={[
                ["/dashboard", "Dashboard", false, true]
            ]} />
            <ComponentSidebar/>
        </>
    );
}

export default EditPage;