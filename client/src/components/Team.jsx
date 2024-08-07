import React, {useState} from "react";
import "../styles/Team.css";
import MemberDisplay from "./MemberDisplay";
import Modal from "./Modal";

function Team({ name, owner, role, members }) {
    const [editModalOpen, openEditModal] = useState(false)
    return (
        <>
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
                    {text: "Save", style: "submit", submit: (name) => {
                        openEditModal(false)
                        // TODO: Make saving work
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