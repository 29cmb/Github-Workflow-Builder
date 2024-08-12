import React from "react";
import Topbar from "../components/Topbar";
import "../styles/Home.css"

function Home(){
    return (
        <>
            <Topbar buttons={[
                    ["/login", "Login", true, false],
                    ["/dashboard", "Dashboard", true, true]
            ]}></Topbar>
            <h1 id="title">Github workflows<br/>made<br/><span id="easyText">easy</span></h1>
            <p id="titleSubtext"><i>Easy to use Github Workflow Builder Tool</i></p>
            <div id="bottom">
                <img id="img1" src="https://placehold.co/500x366" alt="Placeholder" />
                <p id="EasyToUse">Easy to use<br /><span id="dragAndDrop">DRAG AND DROP</span><br />system</p>
                <img id="img2" src="https://placehold.co/500x366" alt="Placeholder" />
                <p id="ImportWorkflows">Import<br /><span id="existing">EXISTING</span><br />workflows</p>
                <img id="img3" src="https://placehold.co/500x366" alt="Placeholder" />
                <p id="EditWorkflows">Edit<br />workflows<br /><span id="visually">VISUALLY</span></p>
            </div>
        </>
    
    )
}

export default Home;