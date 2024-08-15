import React from "react";
import "../styles/Export.css";
import defText from "../export/default.yml";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";

function Export({ components, dragComponents, componentData, setVisible }) {
    return (
        <div id="ExportMenu">
            <h1 id="exportText">Export</h1>
            <div id="ExportPanel">
                <button id="exit" onClick={() => setVisible(false)}>
                    <img src="/assets/Exit.png" alt="Exit" />
                </button>
                <div id="codeblock">
                    <SyntaxHighlighter language="yaml" style={prism}>
                        {defText}
                    </SyntaxHighlighter>
                </div>
            </div>
        </div>
    );
}

export default Export;