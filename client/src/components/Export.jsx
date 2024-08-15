import React from "react";
import "../styles/Export.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import defText from "../export/default.yml";
import style from "../export/style"
import action from "../export/_action.yml" // _ is used to make eslint or whatever shut up
import command from "../export/_command.yml" // _ is used to make eslint or whatever shut up

const CompilerOptions = {
    [1]: {
        level: 1,
        getAddition(element){
            return `\n${action.replace("{actionName}", element.actionName)}`
        }
    }
}

function Export({ componentData, setVisible }) {
    var exportText = defText
    componentData.forEach(element => {
        const cOptions = CompilerOptions[element.cid]
        if(cOptions === undefined) return;
        exportText += cOptions.getAddition(element)

        console.log(element.routes)
        element.routes.forEach(route => {
            const routeData = componentData.find(component => component.id === route.id)
            console.log("Route Data: ", routeData, componentData)
            if(routeData === undefined) return;

            if(routeData.cid == 2){
                var commandText = command.replaceAll("{command}", routeData.commandName)
                exportText += `\n\n${commandText}`
            } else {
                console.log(routeData)
            }
        })
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