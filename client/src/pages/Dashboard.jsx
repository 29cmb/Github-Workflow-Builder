import React from "react";
import Topbar from "../components/Topbar";

function Dashboard() {
    return (
        <Topbar buttons={[
            ["/", "Home", false]
        ]}>
        </Topbar>
    )
}

export default Dashboard;