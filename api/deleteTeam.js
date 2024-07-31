const db = require("../modules/db")
const { authNeeded } = require("../modules/middleware")
const limits = require("../config/limits.json")

module.exports = (app) => {
    app.post("/api/v1/teams/delete", authNeeded, async (req, res) => {
        await db.client.connect()
        const { tid } = req.body
        if(tid == undefined || typeof tid != "number") return res.status(400).json({ success: false, message: "TID not provided or not formatted properly" })
        const team = await db.collections.teams.findOne({ tid })
        if(team == undefined) return res.status(400).json({ success: false, message: "Team does not exist" })
        if(team.oid != req.session.user) return res.status(403).json({ success: false, message: "You do not have permission to delete this team" })

        await db.collections.teams.deleteOne({ tid }) // delete the team
        await db.collections.projects.delete({ creator: { type: "team", id: tid } }) // delete all team projects
        await db.client.close()
    })
    
    return {
        method: "POST",
        route: "/api/v1/teams/delete"
    }
}