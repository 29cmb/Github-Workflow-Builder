import Topbar from "../components/Topbar";
import Form from "../components/Form";
import "../styles/UserPages.css"

function Login(){
    return (
        <div>
            <Topbar buttons={[
                ["/", "Home", false]
            ]}></Topbar>
            <h1>Login</h1>
            <Form
                inputs={[
                    {id: "username", type: "text", placeholder: "Username"},
                    {id: "password", type: "password", placeholder: "Password"}
                ]}
                subtext={<span>Don't have an account?<br/>Sign up <a href="/signup">here!</a></span>}
                buttonData={["Login", (note, username, password) => {
                    fetch("/api/v1/user/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            username, password
                        })
                    }).then(response => response.json()).then(data => {
                        if(data.success) return window.location.href = "/dashboard"
                        note.innerHTML = data.message
                    })
                }]}
            ></Form>
        </div>
    )
}

export default Login;