import "../styles/MemberDisplay.css";
import { Tooltip } from "react-tooltip"

function MemberDisplay({ members }) {
  if(members === undefined) return;
  return (
    <div id="members">
        {members.map((member, index) => {
          return (() => {
            
            if(index < 4) {
              return (
                <>
                  <Tooltip id={`member${index}`} />
                  <img key={index} src={member.img} alt="Member" data-tooltip-id={`member${index}`} className={(() => {
                    switch(member.rank) {
                      case 3:
                        return "owner";
                      case 2:
                        return "manager";
                      default:
                        return "member";
                    }
                  })()} data-tooltip-content={member.name}/>
                </>
              )
            } else if(index === (members.length) - 1) {
              return (<p key={index}>+{members.length - 4}</p>)
            }
          })()
        })}
    </div>
  );
}

export default MemberDisplay;