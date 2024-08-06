import React from "react";
import "../styles/MemberDisplay.css";
function MemberDisplay({ members }) {
  return (
    <div id="members">
        {members.map((member, index) => {
          return (() => {
            if(index < 4) {
              return (<img key={index} src={member.img} alt="Member"/>)
            } else if(index === (members.length) - 1) {
              return (<p key={index}>+{members.length - 4}</p>)
            }
          })()
        })}
    </div>
  );
}

export default MemberDisplay;