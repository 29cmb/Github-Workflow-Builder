import Topbar from "../../components/Topbar";
import ViewPanel from "../../components/ViewPanel";

function ViewPage({ id }){
    return (
        <>
            <Topbar buttons={[
                ["/login", "Login", false, false],
                ["/dashboard", "Dashboard", false, true]
            ]} />
            <ViewPanel pid={id}/>
        </>
    )
}

export default ViewPage;