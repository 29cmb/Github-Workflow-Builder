import React, { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import "../../styles/Account.css";

function Account() {
    const [user, setUser] = useState({});
    const [profile, setProfile] = useState({});

    useEffect(() => {
        fetch("/api/v1/user/credentials", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            setUser(data.user);
        })
        .catch(error => console.error("Failed to fetch user:", error));

        fetch("/api/v1/user/info", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json()).then(data => {
            setProfile(data.user);
        }).catch(error => console.error("Failed to fetch user:", error));
    }, []);

    return (
        <>
            <Topbar buttons={[["/", "Home", false]]} />
            <Sidebar buttons={[
                ["/dashboard", "Projects", false],
                ["/dashboard/teams", "Teams", false],
                ["/dashboard/account", "Account", true]
            ]} />
            <div id="account">
                <h2 id="accountInfo">Account Information</h2>
                <p>Email</p>
                <p id="email">
                    {user.email ? `${user.email[0]}${'*'.repeat(user.email.indexOf('@') - 1)}${user.email.slice(user.email.indexOf('@'))}` : ''}
                </p>
                <p>Username</p>
                <p id="username">{user.username}</p>
                <p>Password</p>
                <p id="password">*************</p>
                <h2 id="Appearance">Appearance</h2>
                <p>Bio</p>
                <p id="bio">{profile.bio}</p>
            </div>
        </>
    );
}

export default Account;