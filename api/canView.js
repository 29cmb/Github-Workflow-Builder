const db = require("../modules/db.js")
module.exports = (app) => {
    app.get("/api/v1/project/:pid/canView", async (req, res) => {
        var { pid } = req.params;
        if(pid === undefined || typeof parseInt(pid) !== "number") return res.status(400).json({ success: false, message: "PID not provided or not formatted properly" });
        pid = parseInt(pid)

        const project = await db.collections.projects.findOne({ pid })
        if(project === undefined || project == null) return res.status(400).json({ success: false, message: "Project does not exist" })
            
        const success = project.public == true || project.creator.id === req.session.user || project.contributors.includes(req.session.user);
        res.status(200).json({ success, message: success ? "User can view project" : "User cannot view project" });
    });
    return {
        method: "GET",
        route: "/api/v1/project/:pid/canView",
    }
}