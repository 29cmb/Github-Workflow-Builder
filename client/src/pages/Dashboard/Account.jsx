import React from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";

function Account(){
    return (
        <>
            <Topbar buttons={[
                ["/", "Home", false]
            ]}>
            </Topbar>
            <Sidebar buttons={[
                ["/dashboard", "Projects", false],
                ["/dashboard/teams", "Teams", false],
                ["/dashboard/account", "Account", true]
            ]}></Sidebar>
        </>
        
    )
}

export default Account;