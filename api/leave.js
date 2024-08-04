const db = require("../modules/db")
const { authNeeded } = require("../modules/middleware")

module.exports = (app) => {
    app.post("/api/v1/teams/leave", authNeeded, async (req, res) => {
        const { tid, uid } = req.body
        if(
            tid == undefined 
            || uid == undefined 
            || typeof tid != "number" 
            || typeof uid != "number"
        ) return res.status(400).json({ success: false, message: "TID or UID not provided or not formatted properly"});

        const team = await db.collections.teams.findOne({ tid })
        if(team == undefined) return res.status(400).json({ success: false, message: "Team does not exist" })
        if(!(req.session.user in team.members)) return res.status(400).json({ success: false, message: "You are not in this team" })
        if(team.oid == req.session.user) return res.status(400).json({ success: false, message: "You cannot leave your own team!" })

        await db.collections.teams.updateOne(
            { tid },
            {
                $pull: {
                    members: uid,
                    "roles.$[].users": uid
                }
            }
        )
        
        res.status(200).json({ success: true, message: "Left successfully" })
    })
    return {
        method: "POST",
        route: "/api/v1/teams/leave"
    }
}