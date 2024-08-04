import React from "react";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";

function Dashboard() {
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
        </>
    );
}

export default Dashboard;