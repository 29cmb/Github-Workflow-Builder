import React, { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import "../../styles/Teams.css";
import Team from "../../components/Team";
import Modal from "../../components/Modal";

function Teams() {
    const getTeams = async () => {
        try {
            const response = await fetch("/api/v1/user/teams", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Failed to fetch teams:", error);
            return [];
        }
    };

    const [teams, setTeams] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        getTeams().then(data => {
            if (data.teams) {
                console.log(data.teams);
                setTeams(data.teams);
            } else {
                console.log("error")
            }
        }).catch(error => console.error("Error setting teams:", error));
    }, []);

    return (
        <>
            <Topbar buttons={[
                ["/", "Home", false]
            ]}>
            </Topbar>
            <Sidebar buttons={[
                ["/dashboard", "Projects", false],
                ["/dashboard/teams", "Teams", true],
                ["/", "Account", false]
            ]}></Sidebar>
            {modalVisible ? <Modal
                title="Create Team"
                inputs={[
                    {id: "teamName", type: "text", placeholder: "Team Name"},
                    {id: "teamDesc", type: "text", placeholder: "Team Description"},
                ]}
                buttons={[
                    {id: "create", text: "Create", style: "submit", submit: (name, description) => {
                        // TODO: Make team
                    }},
                    {id: "cancel", text: "Cancel", style: "cancel", submit: () => {
                        setModalVisible(false);
                    }}
                ]}
            ></Modal> : null}
            <button id="new" onClick={() => {setModalVisible(true)}}><img src="/assets/NewProject.png" alt="New"></img></button>
            <div id="teams">
                <Team name={"Funi Dog Games"} owner={{name: "DevCmb"}} />
                {
                    teams.map(team => (
                        <Team key={team.id} name={team.name} owner={{name: team.creator.name, type: team.creator.type}} />
                    ))
                }
            </div>
        </>
    );
}

export default Teams;