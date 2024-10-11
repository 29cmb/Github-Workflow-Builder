const Components = [
    { cid: 1, color: "red", letter: "A", name: "Action", component: (
        <div className="actionComponent">
            <p id="componentName">Action</p>
            <div className="seperator" />
            <p id="actionName">Action Name</p>
            <div className="seperator" style={{marginTop: "10px"}} />
        </div>
    ), transform: {width: 250, height: 175}, data: [
        {id: "actionName", dataIndex: "actionName", default: "Action Name"}
    ], route: "from" },
    { cid: 2, color: "orange", letter: "C", name: "Command", component: (
        <div className="commandComponent">
            <p id="componentName">Command</p>
            <div className="seperator" />
            <p id="commandName">Linux Command Data<br/>Linux Command Data<br/>Linux Command Data</p>
            <div className="seperator" style={{marginTop: "10px"}} />
        </div>
    ), transform: {width: 250, height: 220}, data: [
        {id: "commandName", dataIndex: "commandName", default: "echo Hello World!"}
    ], route: "to" },
    { cid: 3, color: "#EBFF00", letter: "U", name: "Upload", component: (
        <div className="uploadComponent">
            <p id="componentName">Upload</p>
            <div className="seperator" />
            <p id="uploadRules">*.exe<br/>*.dll<br/>*.sys</p>
            <div className="seperator" style={{marginTop: "10px"}} />
        </div>
    ), transform: {width: 250, height: 220}, data: [
        {id: "uploadRules", dataIndex: "uploadRules", default: "*exe"}
    ], route: "to" },
    { cid: 4, color: "lime", letter: "N", name: "NodeJS", component: (
        <div className="nodeComponent">
            <p id="componentName">Setup NodeJS</p>
            <div className="seperator" />
            <p id="version">v20</p>
            <div className="seperator" style={{marginTop: "10px"}} />
        </div>
    ), transform: {width: 250, height: 175}, data: [
        {id: "version", dataIndex: "version", default: "v20"}
    ], route: "to" },
    { cid: 5, color: "gray", letter: "D", name: "Download", component: (
        <div className="downloadComponent">
            <p id="componentName">Download Artifact</p>
            <div className="seperator" />
            <p id="artifactName">Artifact Name</p>
            <div className="seperator" style={{marginTop: "10px"}} />
        </div>
    ), transform: {width: 300, height: 175}, data: [
        {id: "artifactName", dataIndex: "artifactName", default: "Artifact Name"}
    ], route: "to" },
    { cid: 6, color: "#2da1ff", letter: "P", name: "Python", component: (
        <div className="pythonComponent">
            <p id="componentName">Setup Python</p>
            <div className="seperator" />
            <p id="pythonVersion">Version</p>
            <div className="seperator" style={{marginTop: "10px"}} />
        </div>
    ), transform: {width: 250, height: 175}, data: [
        {id: "pythonVersion", dataIndex: "pythonVersion", default: "v3.12"}
    ], route: "to" },
    { cid: 7, color: "#f89820", letter: "J", name: "Java", component: (
        <div className="javaComponent">
            <p id="componentName">Setup Java <p id="distro">(temurin)</p></p>
            <div className="seperator" />
            <p id="javaVersion">Version</p>
            <div className="seperator" style={{marginTop: "10px"}} />
        </div>
    ), transform: {width: 250, height: 175}, data: [
        {id: "javaVersion", dataIndex: "javaVersion", default: "v21"}
    ], route: "to" }
];

export default Components