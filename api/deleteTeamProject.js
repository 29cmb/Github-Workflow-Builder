const db = require("../modules/db")
const { authNeeded } = require("../modules/middleware")

module.exports = (app) => {
    app.post("/api/v1/teams/projects/delete", authNeeded, async (req, res) => {
        await db.client.connect()
        const { pid } = req.body
        if(pid == undefined || typeof pid != "number") return res.status(400).json({ success: false, message: "PID not provided or formatted wrong." })
        const project = db.collections.projects.findOne({ pid, creator: { type: "team" } })
        if(project == undefined) return res.status(400).json({ success: false, message: "Project does not exist" })

        const team = await db.collections.teams.findOne({ tid: project.creator.id })
        if(team == undefined) return res.status(400).json({ success: false, message: "Team does not exist" })
        if(!(req.session.user in team.members)) return res.status(400).json({ success: false, message: "You do not have permissions to delete this project" })
        await db.collections.projects.deleteOne({ pid })
        await db.client.close()
    })
    return {
        method: "POST",
        route: "/api/v1/projects/delete"
    }
}