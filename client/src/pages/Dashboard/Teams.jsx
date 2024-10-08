import { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import "../../styles/Teams.css";
import Team from "../../components/Team";
import Modal from "../../components/Modal";
import toast, { Toaster } from 'react-hot-toast';

function Teams() {
    const getTeams = async () => {
        try {
            const response = await fetch("/api/v1/user/teams", {
                method: "GET",
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
                setTeams(data.teams);
            } else {
                console.log("error", data)
            }
        }).catch(error => console.error("Error setting teams:", error));
    }, []);

    return (
        <>
            <Topbar buttons={[
                ["/", "Home", false]
            ]} />
            <Sidebar buttons={[
                ["/dashboard", "Projects", false],
                ["/dashboard/teams", "Teams", true],
                ["/dashboard/account", "Account", false]
            ]} />
            <Toaster />
            {modalVisible ? <Modal
                title="Create Team"
                inputs={[
                    {id: "teamName", type: "text", placeholder: "Team Name"},
                    {id: "teamDesc", type: "text", placeholder: "Team Description"},
                ]}
                buttons={[
                    {id: "create", text: "Create", style: "submit", sendArgs: true, submit: (name, description) => {
                        setModalVisible(false)
                        fetch("/api/v1/teams/new", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                name,
                                description
                            })
                        }).then(response => response.json()).then(data => {
                            if(data.success === true){
                                toast("Your team has been created successfully! Reloading...", {
                                    icon: "✅",
                                    style: {
                                        color: "white",
                                        backgroundColor: "#333",
                                        borderRadius: "10px",
                                        maxWidth: "60%",
                                    }
                                });
                                setTimeout(() => {
                                    window.location.reload()
                                }, 1000)
                            } else {
                                toast(`There was an error creating your team: ${data.message}`, {
                                    icon: "❌",
                                    style: {
                                        color: "white",
                                        backgroundColor: "#333",
                                        borderRadius: "10px",
                                        maxWidth: "60%",
                                    }
                                });
                            }
                        })
                    }},
                    {id: "cancel", text: "Cancel", style: "cancel", submit: () => {
                        setModalVisible(false);
                    }}
                ]}
             /> : null}
            <button id="new" onClick={() => {setModalVisible(true)}}><img src="/assets/NewProject.png" alt="New" /></button>
            <div id="teams">
                {
                    teams.map(team => {
                        return (<Team key={team.tid} tid={team.tid} name={team.name} owner={{name: team.owner}} role={team.role}/>)
                    })
                }
            </div>
        </>
    );
}

export default Teams;