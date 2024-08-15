const db = require("../modules/db")
const { readRateLimit } = require("../modules/middleware")

module.exports = (app) => {
    app.get("/api/v1/projects/:pid/get", readRateLimit, async (req, res) => {
        var { pid } = req.params
        if(pid == undefined || typeof(parseInt(pid)) != "number") return res.status(400).json({ success: false, message: "PID not provided or not formatted properly" })
        pid = parseInt(pid)
        var project = await db.collections.projects.findOne({ pid })
        if(project === undefined) return res.status(404).json({ success: false, message: "Project does not exist." })
        if(project.public == false && req.session.user != project.creator.id && !(req.session.user in project.contributors)) return res.status(400).json({ success: false, message: "You cannot view this project!" })
        
        res.status(200).json({ success: true, project })
    })
    return {
        method: "GET",
        route: "/api/v1/projects/:pid/get"
    }
}