import React from "react";
function MemberDisplay({ members }) {
  return (
    <div>
        {members.map((member, index) => {
            return (<img src={member.img} alt="Member"/>)
        })}
    </div>
  );
}

export default MemberDisplay;