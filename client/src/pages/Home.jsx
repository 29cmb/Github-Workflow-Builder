import Topbar from "../components/Topbar";
import "../styles/Home.css"

function Home(){
    return (
        <>
            <Topbar buttons={[
                ["/gallery", "Gallery", false],
                ["/login", "Login", true, false],
                ["/dashboard", "Dashboard", true, true],
                    
            ]} />
            <div id="bg" />
            <h1 id="title">Github workflows<br/>made<br/><span id="easyText">easy</span></h1>
            <p id="titleSubtext"><i>Easy to use Github Workflow Builder Tool</i></p>
            <div id="bottom">
                <img id="img1" src="/assets/Point1.png" alt="Point 1" />
                <p id="EasyToUse">Easy to use<br /><span id="dragAndDrop">DRAG AND DROP</span><br />system</p>
                <img id="img2" src="/assets/Point2.png" alt="Placeholder" />
                <p id="EditWorkflows">Edit<br />workflows<br /><span id="visually">VISUALLY</span></p>
            </div>
        </>
    
    )
}

export default Home;