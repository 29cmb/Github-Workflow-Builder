import "../styles/Export.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import defText from "../export/default.yml";
import style from "../export/style"
import action from "../export/_action.yml" // _ is used to make eslint or whatever shut up
import command from "../export/_command.yml" // _ is used to make eslint or whatever shut up
import upload from "../export/_upload.yml" // you should know by now
import node from "../export/_node.yml"
import download from "../export/_download.yml"
import python from "../export/_python.yml"
import java from "../export/_java.yml"

const CompilerOptions = {
    1: {
        level: 1, // Level means what layer it gets executed in (1 is jobs layer, 2 is inside of an action)
        getAddition(data){
            return `\n${action.replaceAll("{actionName}", data.actionName)}`
        }
    },
    2: {
        level: 2,
        getAddition(data){
            return `\n\n${command.replaceAll("{command}", data.commandName)}`
        }
    },
    3: {
        level: 2,
        getAddition(data){
            return `\n\n${upload.replaceAll("{artifactFilters}", data.uploadRules)}`
        }
    },
    4: {
        level: 2,
        getAddition(data){
            if (!data.version.startsWith('v')) return;
            return `\n\n${node.replaceAll("{nodeVersion}", `'${data.version.substring(1)}'`)}`
        }
    },
    5: {
        level: 2,
        getAddition(data){
            return `\n\n${download.replaceAll("{artifactName}", data.artifactName)}`
        }
    },
    6: {
        level: 2,
        getAddition(data){
            if (!data.pythonVersion.startsWith('v')) return;
            return `\n\n${python.replaceAll("{pythonVersion}", `'${data.pythonVersion.substring(1)}'`)}`
        }
    },
    7: {
        level: 2,
        getAddition(data){
            if (!data.javaVersion.startsWith('v')) return;
            return `\n\n${java.replaceAll("{javaVersion}", `'${data.javaVersion.substring(1)}'`)}`
        }
    }
}

function Export({ componentData, setVisible }) {
    var exportText = defText
    componentData.forEach(element => {
        const cOptions = CompilerOptions[element.cid]
        if(cOptions === undefined || cOptions.level !== 1) return;
        exportText += cOptions.getAddition(element)

        element.routes.forEach(route => {
            const routeData = componentData.find(component => component.id === route.id)
            if(routeData === undefined) return;

            const rCOptions = CompilerOptions[routeData.cid]
            if(rCOptions === undefined || rCOptions.level !== 2) return;

            exportText += rCOptions.getAddition(routeData)
        })
    });
    return (
        <div id="ExportMenu">
            <h1 id="exportText">Export</h1>
            <div id="ExportPanel">
                <button id="exit" onClick={() => setVisible(false)}>
                    <img src="/assets/Exit.png" alt="Exit" />
                </button>
                <p id="codeNote">Place this code in your<br/><code>.github/workflows</code> folder as a <code>.yml</code> file</p>
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