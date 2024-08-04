const db = require("../modules/db")

module.exports = (app) => {
    app.post("/api/v1/projects/get", async (req, res) => {
        const { pid } = req.body
        if(pid == undefined || typeof pid != "number") return res.status(400).json({ success: false, message: "PID not provided or not formatted properly" })
        var project = await db.collections.projects.findOne({ pid })
        if(project.public == false && req.session.user != project.owner.id && !(req.session.user in project.contributors)) return res.status(400).json({ success: false, message: "You cannot view this project!" })
        
        res.status(200).json({ success: true, project })
    })
    return {
        method: "POST",
        route: "/api/v1/projects/get"
    }
}