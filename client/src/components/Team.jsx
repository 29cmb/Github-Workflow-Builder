import React from "react";
import "../styles/Team.css";
import MemberDisplay from "./MemberDisplay";

function Team({ name, owner, role }) {
    return (
        <div className="team">
            <img src="/assets/FullLogo.png" alt="Team"></img>
            <p id="name">{name}</p>
            <p id="owner">Owned by: <span className="user">{owner.name}</span></p>
            <p id="role">{role}</p>
            <MemberDisplay
                members={[
                    { img: "/assets/Red.png" },
                    { img: "/assets/Orange.png" },
                    { img: "/assets/Green.png" },
                    { img: "/assets/Blue.png" },
                    { img: "/assets/Purple.png" }
                ]}
            />
        </div>
    )
}

export default Team;