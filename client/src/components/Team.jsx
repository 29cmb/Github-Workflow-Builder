import React, {useState} from "react";
import "../styles/Team.css";
import MemberDisplay from "./MemberDisplay";
import Modal from "./Modal";
import toast, { Toaster } from "react-hot-toast";

function Team({ tid, name, owner, role, members }) {
    const [editModalOpen, openEditModal] = useState(false)
    return (
        <>
            <Toaster />
            {editModalOpen && <Modal
                title={"Edit Team"}
                inputs={[
                    ...(role === "Owner" ? [{ id: "name", type: "text", placeholder: "Team Name" }] : [{ id: "name", type: "text", placeholder: "Team Name (❌)", disabled: true }]),
                    ...(role === "Owner" ? [{ id: "description", type: "text", placeholder: "Team Description" }] : [{ id: "description", type: "text", placeholder: "Team Description (❌)", disabled: true }]),
                ]}
                buttons = {[
                    ...(role === "Owner" || role === "Manager" ? [{text: "Edit Members", style: "info", submit: () => {
                        openEditModal(false)
                        // TODO: Make another modal for editing members
                    }}] : []),
                    {text: "Save", style: "submit", submit: (name, description) => {
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
                                toast(`Your team has been edited successfully! Reloading...`, {
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
                    }},
                    {text: "Cancel", style: "cancel", submit: () => {openEditModal(false)}}
                ]}
            />}
            <div className="team">
                <button id="settingsLogo" onClick={() => {openEditModal(true)}}><img src="/assets/Settings.png" alt="Settings"></img></button>
                <img src="/assets/FullLogo.png" alt="Team" id="teamLogo"></img>
                <p id="name">{name}</p>
                <p id="owner">Owned by: <span className="user">{owner.name}</span></p>
                <p id="role">{role}</p>
                <MemberDisplay
                    members={members}
                />
            </div>
        </>
        
    )
}

export default Team;