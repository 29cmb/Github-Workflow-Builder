import {useEffect, useState} from "react";
import "../styles/Team.css";
import MemberDisplay from "./MemberDisplay";
import Modal from "./Modal";
import toast, { Toaster } from "react-hot-toast";

function Team({ tid, name, owner, role }) {
    const [editModalOpen, openEditModal] = useState(false)
    const [editMembersModalOpen, openEditMembersModal] = useState(false)
    const [inviteUserModalOpen, openInviteUserModal] = useState(false)
    const [pendingInvitesModalOpen, openPendingInvitesModal] = useState(false)
    const [pendingInvites, setPendingInvites] = useState([])
    const [memberData, setMemberData] = useState({});

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const newMembersData = {};
                const response = await fetch(`/api/v1/teams/${tid}/members`);
                const data = await response.json();

                if (!Array.isArray(data.members)) {
                    console.error("Expected data.members to be an array, but got:", typeof data.members);
                    return;
                }

                newMembersData[tid] = await Promise.all(data.members.map(async (member) => {
                    const response = await fetch(`/api/v1/user/${member.uid}/pfp`);
                    const img = response.url;
                    return {
                        name: member.username,
                        rank: member.rank,
                        img: img
                    };
                }));
                setMemberData(newMembersData);
            } catch (error) {
                console.error("Error fetching members:", error);
            }
        };

        fetchMembers();
    }, [tid]);

    useEffect(() => {
        if(role === "Manager" || role === "Owner"){
            fetch(`/api/v1/team/${tid}/invites`).then(r => r.json()).then(data => {
                if(data.success === true){
                    setPendingInvites(data.invites)
                } else {
                    toast(`An error occured while fetching your team's invites: ${data.message}`, {
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
        }
    }, [role, tid])

    return (
        <>
            <Toaster />
            {editModalOpen && <Modal
                title={"Edit Team"}
                inputs={[
                    ...(role === "Owner" ? [{ id: "name", type: "text", placeholder: "Team Name" }] : []),
                    ...(role === "Owner" ? [{ id: "description", type: "text", placeholder: "Team Description" }] : []),
                ]}
                buttons = {[
                    ...(role === "Owner" || role === "Manager" ? [{text: "Edit Members", style: "info", submit: () => {
                        openEditModal(false)
                        openEditMembersModal(true)
                    }}] : []),
                    ...(role === "Owner" ? [{text: "Save", style: "submit", sendArgs: true, submit: (name, description) => {
                        openEditModal(false)
                        fetch("/api/v1/teams/edit", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                tid,
                                name,
                                description
                            })
                        }).then(r => r.json()).then(data => {
                            if(data.success === true){
                                toast("Your team has been edited successfully! Reloading...", {
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
                                toast(`An error occured while editing your team: ${data.message}`, {
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
                    }}] : []),
                    ...(role !== "Owner" ? [{text: "Leave Team", style: "danger", submit: () => {
                        const leave = window.confirm("Are you sure you would like to leave this team?")
                        if(leave){
                            openEditModal(false)
                            fetch("/api/v1/teams/leave", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    tid
                                })
                            }).then(r => r.json()).then(data => {
                                if(data.success === true){
                                    toast("You have left the team successfully! Reloading...", {
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
                                    toast(`An error occured while leaving the team: ${data.message}`, {
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
                        }
                    }}] : [
                        {text: "Delete Team", style: "danger", submit: () => {
                            const leave = window.confirm("Are you sure you would like to delete this team?")
                            if(leave){
                                const confirmation = window.confirm("THIS IS IRREVERSIBLE! All members will be kicked and all team projects will be PERMANENTLY DELETED! Are you sure you would like to continue?")
                                if(confirmation){
                                    openEditModal(false)
                                    fetch("/api/v1/teams/delete", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            tid
                                        })
                                    }).then(r => r.json()).then(data => {
                                        if(data.success === true){
                                            toast("You have deleted the team successfully! Reloading...", {
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
                                            toast(`An error occured while deleting the team: ${data.message}`, {
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
                                }   
                            }
                        }}
                    ]),
                    {text: "Cancel", style: "cancel", submit: () => {openEditModal(false)}}
                ]}
            />}
            {editMembersModalOpen && <Modal
                title={"Edit Members"}
                inputs={[
                   {type: "combobox", id: "member", options: memberData.map((m) => m.name)},
                   ...(role === "Owner" ? [{type: "combobox", id: "role", options: ["Member", "Manager"]}] : [])
                ]}
                buttons = {[
                    ...(role === "Owner" ? [{text: "Save", style: "submit", sendArgs: true, submit: (username, role) => {
                        openEditMembersModal(false)
                        fetch(`/api/v1/user/username/${username}`).then(r => r.json()).then(data => {
                            if(data.success === true){
                                fetch("/api/v1/teams/rank", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        tid,
                                        uid: data.user.uid,
                                        rank: role === "Manager" ? 2 : 1
                                    })
                                }).then(r => r.json()).then(data2 => {
                                    if(data2.success === true){
                                        toast("Saved member successfully! Reloading...", {
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
                                        toast(`An error occured while editing your team: ${data2.message}`, {
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
                            } else {
                                toast(`An error occured while editing your team: ${data.message}`, {
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
                    }}]: []),
                    {text: "Kick", style: "danger", sendArgs: true, submit: (username, _) => {
                        openEditMembersModal(false)
                        fetch(`/api/v1/user/username/${username}`).then(r => r.json()).then(data => {
                            if(data.success === true){
                                fetch("/api/v1/teams/kick", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        tid,
                                        uid: data.user.uid
                                    })
                                }).then(r => r.json()).then(data2 => {
                                    if(data2.success === true){
                                        toast("Kicked member successfully! Reloading...", {
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
                                        toast(`An error occured while kicking this member: ${data2.message}`, {
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
                            } else {
                                toast(`An error occured while editing your team: ${data.message}`, {
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
                    {text: "Invites", style: "info", submit: () => {
                        openEditMembersModal(false)
                        openInviteUserModal(true)
                    }},
                    {text: "Cancel", style: "cancel", submit: () => {
                        openEditMembersModal(false)
                        openEditModal(true)
                    }}
                ]}
            />}
            {inviteUserModalOpen && <Modal
                title={"Invite User"}
                inputs={[
                    {type: "text", id: "username", placeholder: "Username"}
                ]}
                buttons = {[
                    {text: "Invite", style: "submit", sendArgs: true, submit: (username) => {
                        openInviteUserModal(false)
                        fetch(`/api/v1/user/username/${username}`).then(r => r.json()).then(data => {
                            if(data.success === true){
                                fetch("/api/v1/teams/invite", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        tid,
                                        uid: data.user.uid
                                    })
                                }).then(r => r.json()).then(data2 => {
                                    if(data2.success === true){
                                        toast("Invited user successfully! Reloading...", {
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
                                        toast(`An error occured while inviting this user: ${data2.message}`, {
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
                            } else {
                                toast(`An error occured while editing your team: ${data.message}`, {
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
                    {text: "Pending Invites", style: "info", submit: () => {
                        openInviteUserModal(false)
                        openPendingInvitesModal(true)
                    }},
                    {text: "Cancel", style: "cancel", submit: () => {
                        openInviteUserModal(false)
                        openEditMembersModal(true)
                    }}
                ]}
            />}
            {pendingInvitesModalOpen && <Modal
                    title={"Pending Invites"}
                    inputs={[
                        {type: "combobox", id: "invite", options: pendingInvites.map(i => i.user.username)}
                    ]}
                    buttons = {[
                        {text: "Remove Invite", style: "danger", sendArgs: true, submit: (username) => {
                            if(pendingInvites.length === 0) return;
                            openPendingInvitesModal(false)
                            fetch(`/api/v1/user/username/${username}`).then(r => r.json()).then(data => {
                                if(data.success){
                                    fetch("/api/v1/team/invite/cancel", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            tid,
                                            uid: data.user.uid
                                        })
                                    }).then(r => r.json()).then(data2 => {
                                        if(data2.success){
                                            toast("Invite removed successfully! Reloading...", {
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
                                            toast(`An error occured while removing the invite: ${data2.message}`, {
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
                                }
                            }).catch(e => {
                                toast(`An error occured while removing the invite: ${e}`, {
                                    icon: "❌",
                                    style: {
                                        color: "white",
                                        backgroundColor: "#333",
                                        borderRadius: "10px",
                                        maxWidth: "60%",
                                    }
                                });
                            })
                        }},
                        {text: "Cancel", style: "cancel", submit: () => {
                            openPendingInvitesModal(false)
                            openInviteUserModal(true)
                        }}
                    ]}
                />
            }
            <div className="team">
                <button id="settingsLogo" onClick={() => {openEditModal(true)}}><img src="/assets/Settings.png" alt="Settings"></img></button>
                <img src="/assets/FullLogo.png" alt="Team" id="teamLogo"></img>
                <p id="name">{name}</p>
                <p id="owner">Owned by: <span className="user">{owner.name}</span></p>
                <p id="role">{role}</p>
                <MemberDisplay
                    members={(memberData !== undefined && memberData[tid] !== undefined && memberData[tid].length > 0) ? memberData[tid] : undefined}
                />
            </div>
        </>
        
    )
}

export default Team;