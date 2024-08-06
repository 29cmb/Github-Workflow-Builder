import React from "react";
import "../styles/Team.css";
import MemberDisplay from "./MemberDisplay";

function Team({ name, owner, role, members }) {
    return (
        <div className="team">
            <img src="/assets/FullLogo.png" alt="Team"></img>
            <p id="name">{name}</p>
            <p id="owner">Owned by: <span className="user">{owner.name}</span></p>
            <p id="role">{role}</p>
            <MemberDisplay
                members={members}
            />
        </div>
    )
}

export default Team;