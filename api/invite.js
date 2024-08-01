const db = require("../modules/db")
const { authNeeded } = require("../modules/middleware")

module.exports = (app) => {
    app.post("/api/v1/teams/invite", authNeeded, async (req, res) => {
        await db.client.connect()
        const { uid, tid } = req.body
        if(uid == undefined || tid == undefined || typeof uid != "number" || typeof tid != "number") return res.status(400).json({ success: false, message: "UID or TID not provided or not formatted properly" })
        const user = await db.collections.profiles.findOne({ uid })
        if(user == undefined) return res.status(400).json({ success: false, message: "User does not exist." })
        const team = await db.collections.teams.findOne({ tid })
        if(team == undefined) return res.status(400).json({ success: false, message: "Team does not exist." })
        if(user in team.members) return res.status(400).json({ success: false, message: "User is already in the team." })

        var isManager = false
        [2,3].forEach(rnk => {
            team.roles.find(r => r.rank === rnk).users.forEach((u) => {
                if(u == req.session.user){
                    isManager = true
                }
            })
        })

        if(isManager == false) return res.status(400).json({ success: false, message: "You are not authorized to invite people to this team!" })
        
        await db.client.close()
    })
    return {
        method: "POST",
        route: "/api/v1/teams/invite"
    }
}