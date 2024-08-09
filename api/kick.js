const db = require("../modules/db")
const { authNeeded, writeRateLimit } = require("../modules/middleware")

module.exports = (app) => {
    app.post("/api/v1/teams/kick", authNeeded, writeRateLimit, async (req, res) => {
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
        if (team.roles && Array.isArray(team.roles)) {
            [2, 3].forEach(rank => {
                const role = team.roles.find(r => r.rank === rank);
                if (role) {
                    role.users.forEach(user => {
                        if (user === req.session.user) {
                            isManager = true;
                        }
                    });
                } else {
                    console.error(`Role with rank ${rank} not found`);
                }
            });
        } else {
            console.error("Roles are not defined or not an array");
        }

        if(isManager == false) return res.status(400).json({ success: false, message: "You are not authorized to kick people from this team!" })

        const user = await db.collections.profiles.findOne({ uid })
        if(user == undefined) return res.status(400).json({ success: false, message: "User does not exist" })
        if(!team.members.contains(user.uid)) return res.status(400).json({ success: false, message: "User is not in the team" })
        if(user.uid == req.session.user) return res.status(400).json({ success: false, message: "You cannot kick yourself" })

        var isUserManager = false
        if (team.roles && Array.isArray(team.roles)) {
            [2, 3].forEach(rank => {
                const role = team.roles.find(r => r.rank === rank);
                if (role) {
                    role.users.forEach(user => {
                        if (user === user.uid) {
                            isUserManager = true;
                        }
                    });
                } else {
                    console.error(`Role with rank ${rank} not found`);
                }
            });
        } else {
            console.error("Roles are not defined or not an array");
        }

        if(isUserManager && team.oid != req.session.user) return res.status(400).json({ success: false, message: "You cannot kick a manager" })
        
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
    })
    return {
        method: "POST",
        route: "/api/v1/teams/kick"
    }
}