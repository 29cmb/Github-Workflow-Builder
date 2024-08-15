import React from "react";
import "../styles/Export.css";

function Export({ components, dragComponents, componentData, setVisible }){
    return (
        <div id="ExportMenu">
            <h1 id="exportText">Export</h1>
            <div id="ExportPanel">
                <button id="exit" onClick={() => setVisible(false)}>
                    <img src="/assets/Exit.png"></img>
                </button>
            </div>
        </div>
    );
}

export default Export;