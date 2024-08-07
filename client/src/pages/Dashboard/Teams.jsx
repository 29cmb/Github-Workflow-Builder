import React, { useEffect, useState } from "react";
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
    const [membersData, setMembersData] = useState({});
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

    useEffect(() => {
        const fetchMemberImages = async () => {
            const newMembersData = {};
            for (const team of teams) {
                const response = await fetch(`/api/v1/teams/${team.tid}/members`)
                const { members } = await response.json();
                newMembersData[team.id] = await Promise.all(members.map(async (member) => {
                    const response = await fetch(`/api/v1/user/${member.uid}/pfp`);
                    const img = response.url;
                    return {
                        name: member.username,
                        img: img
                    };
                }));
            }
            setMembersData(newMembersData);
        };

        fetchMemberImages();
    }, [teams]);

    return (
        <>
            <Topbar buttons={[
                ["/", "Home", false]
            ]}>
            </Topbar>
            <Sidebar buttons={[
                ["/dashboard", "Projects", false],
                ["/dashboard/teams", "Teams", true],
                ["/dashboard/account", "Account", false]
            ]}></Sidebar>
            <Toaster />
            {modalVisible ? <Modal
                title="Create Team"
                inputs={[
                    {id: "teamName", type: "text", placeholder: "Team Name"},
                    {id: "teamDesc", type: "text", placeholder: "Team Description"},
                ]}
                buttons={[
                    {id: "create", text: "Create", style: "submit", submit: (name, description) => {
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
                                toast(`Your team has been created successfully! Reloading...`, {
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
            ></Modal> : null}
            <button id="new" onClick={() => {setModalVisible(true)}}><img src="/assets/NewProject.png" alt="New"></img></button>
            <div id="teams">
                {
                    teams.map(team => {
                        const members = membersData[team.id] || team.members.map(member => ({
                            name: member.username,
                            img: ''
                        }));

                        return (<Team key={team.id} name={team.name} owner={{name: team.owner}} role={team.role} members={members}/>)
                    })
                }
            </div>
        </>
    );
}

export default Teams;