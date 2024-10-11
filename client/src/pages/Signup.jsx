import Topbar from "../components/Topbar";
import Form from "../components/Form";
import "../styles/UserPages.css"

function Signup(){
    return (
        <div>
            <Topbar buttons={[
                ["/gallery", "Gallery", false],
                ["/", "Home", false]
            ]} />
            <h1>Signup</h1>
            <Form
                inputs={[
                    {id: "email", type: "email", placeholder: "Email"},
                    {id: "username", type: "text", placeholder: "Username"},
                    {id: "password", type: "password", placeholder: "Password"}
                ]}
                subtext={<span>Already have an account?<br/>Log in <a href="/login">here!</a></span>}
                buttonData={["Signup", (note, email, username, password) => {
                    fetch("/api/v1/user/signup", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email, username, password
                        })
                    }).then(response => response.json()).then(data => {
                        note.innerHTML = data.message
                        if(data.success === true){
                            note.style.color = "rgb(0,255,0)"
                        } else {
                            note.style.color = "rgb(255,0,0)"
                        }
                    })
                }]}
             />
        </div>
    )
}

export default Signup;