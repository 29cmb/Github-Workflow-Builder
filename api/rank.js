const db = require("../modules/db.js")
const { authNeeded, writeRateLimit } = require("../modules/middleware.js")
module.exports = (app) => {
    app.post("/api/v1/teams/rank", authNeeded, writeRateLimit, async (req, res) => {
        const { tid, uid, rank } = req.body
        if(
            tid == undefined 
            || uid == undefined 
            || rank == undefined 
            || typeof tid != "number" 
            || typeof uid != "number" 
            || typeof rank != "number"
            || rank > 2
            || rank < 0
        ) return res.status(400).json({ success: false, message: "TID, UID, or Rank not provided or not formatted properly" }); // that is infact a semicolon
        
        const team = await db.collections.teams.findOne({ tid })
        if(team == undefined) return res.status(400).json({ success: false, message: "Team does not exist" });
        if(team.oid != req.session.user) return res.status(403).json({ success: false, message: "You are not allowed to change ranks for that team" });

        const user = await db.collections.profiles.findOne({ uid })
        if(user == undefined) return res.status(400).json({ success: false, message: "User does not exist" });
        if(!team.members.includes(uid)) return res.status(400).json({ success: false, message: "User is not in the team" })
        if(user.uid == req.session.user) return res.status(400).json({ success: false, message: "You cannot change your own rank" })
        
        
        await db.collections.teams.updateOne({ tid },
            {
                $pull: {
                    "roles.$[].users": uid
                },
            }
        )

        await db.collections.teams.updateOne({ tid }, 
            {
                $push: {
                    [`roles.$[role].users`]: uid
                }
            },
            {
                arrayFilters: [{ "role.rank": rank }]
            }
        )

        res.status(200).json({ success: true, message: "User has been ranked" })
    })
    return {
        method: "POST",
        route: "/api/v1/teams/rank"
    }
}