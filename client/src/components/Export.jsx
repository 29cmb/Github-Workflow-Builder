import React from "react";
import "../styles/Export.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import defText from "../export/default.yml";
import style from "../export/style"

function Export({ components, dragComponents, componentData, setVisible }) {
    var exportText = defText
    componentData.forEach(element => {
        
    });
    return (
        <div id="ExportMenu">
            <h1 id="exportText">Export</h1>
            <div id="ExportPanel">
                <button id="exit" onClick={() => setVisible(false)}>
                    <img src="/assets/Exit.png" alt="Exit" />
                </button>
                <p id="codeNote">Place this code in your<br/><code>.github/workflows</code> folder as a <code>.yml</code></p>
                <div id="codeblock">
                    <SyntaxHighlighter language="yaml" style={style}>
                        {exportText}
                    </SyntaxHighlighter>
                </div>
            </div>
        </div>
    );
}

export default Export;