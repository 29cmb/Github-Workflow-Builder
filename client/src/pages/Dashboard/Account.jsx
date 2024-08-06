import React from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import "../../styles/Account.css";

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
            <div id="account">
                <h2 id="accountInfo">Account Information</h2>
                <p>Username</p>
                <p id="username">your username</p>
                <p>Password</p>
                <p id="password">*************</p>
                <h2 id="Appearance">Appearance</h2>
                <p>Bio</p>
                <p id="bio">your bio</p>
            </div>
        </>
        
    )
}

export default Account;