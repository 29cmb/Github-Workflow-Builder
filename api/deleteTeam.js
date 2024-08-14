const db = require("../modules/db")
const { authNeeded, writeRateLimit } = require("../modules/middleware")

module.exports = (app) => {
    app.post("/api/v1/teams/delete", authNeeded, writeRateLimit, async (req, res) => {
        const { tid } = req.body
        if(tid == undefined || typeof tid != "number") return res.status(400).json({ success: false, message: "TID not provided or not formatted properly" })
        const team = await db.collections.teams.findOne({ tid })
        if(team == undefined) return res.status(400).json({ success: false, message: "Team does not exist" })
        if(team.oid != req.session.user) return res.status(403).json({ success: false, message: "You do not have permission to delete this team" })

        await db.collections.teams.deleteOne({ tid }) // delete the team
        await db.collections.projects.deleteMany({ creator: { type: "team", id: tid } }) // delete all team projects

        res.status(200).json({ success: true, message: "Team has been deleted." })
    })
    
    return {
        method: "POST",
        route: "/api/v1/teams/delete"
    }
}