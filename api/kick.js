const db = require("../modules/db")
const { authNeeded } = require("../modules/middleware")

module.exports = (app) => {
    app.post("/api/v1/teams/kick", authNeeded, async (req, res) => {
        await db.client.connect()
        const { tid, uid } = req.body
        if(
            tid == undefined 
            || uid == undefined 
            || typeof tid != "number" 
            || typeof uid != "number"
        ) return res.status(400).json({ success: false, message: "TID or UID not provided or not formatted properly" });

        const team = await db.collections.teams.findOne({ tid })
        if(team == undefined) return res.status(400).json({ success: false, message: "Team does not exist" })
        
        var isManager = false
        [2,3].forEach(rnk => {
            team.roles.find(r => r.rank === rnk).users.forEach((u) => {
                if(u == req.session.user){
                    isManager = true
                }
            })
        })

        if(isManager == false) return res.status(400).json({ success: false, message: "You are not authorized to kick people from this team!" })

        const user = await db.collections.profiles.findOne({ uid })
        if(user == undefined) return res.status(400).json({ success: false, message: "User does not exist" })
        if(!(user.uid in team.members)) return res.status(400).json({ success: false, message: "User is not in the team" })
        
        await db.collections.teams.updateOne(
            { tid },
            {
                $pull: {
                    members: uid,
                    "roles.$[].users": uid
                }
            }
        )

        res.status(200).json({ success: true, message: "User has been kicked" })
        await db.client.close()
    })
    return {
        method: "POST",
        route: "/api/v1/teams/kick"
    }
}