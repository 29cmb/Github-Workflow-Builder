const db = require("../modules/db")
const { authNeeded } = require("../modules/middleware")

module.exports = (app) => {
    app.post("/api/v1/projects/delete", authNeeded, async (req, res) => {
        await db.client.connect()
        const { pid } = req.body
        if(pid == undefined || typeof pid != "number") return res.status(400).json({ success: false, message: "PID not provided or not formatted properly" })
        const project = await db.collections.projects.findOne({ pid })
        if(project == undefined) return res.status(400).json({ success: false, message: "Project does exist" })
        
        if(project.owner.type == "user"){
            if(project.owner.id != req.session.user) return res.status(403).json({ success: false, message: "You do not have permission to delete this project"})
        } else if(project.owner.type == "team"){
            const team = await db.collections.teams.findOne({ tid: project.owner.id })
            if(!(req.session.uid in team.members)) return res.status(403).json({ success: false, message: "You do not have permission to delete this project"})
        }
     
        await db.collections.projects.deleteOne({ pid })
        res.status(200).json({ success: true, message: "Deleted project successfully" })
        await db.client.close()
    })
    return {
        method: "POST",
        route: "/api/v1/projects/delete"
    }
}