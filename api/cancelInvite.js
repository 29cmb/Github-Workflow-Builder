const db = require("../modules/db")

module.exports = (app) => {
    app.post("/api/v1/team/invite/cancel", async (req, res) => {
        const { uid, tid } = req.body
        if(uid === undefined || typeof uid !== "number" || tid === undefined || typeof tid !== "number") return res.status(400).json({ success: false, message: "UID or TID not provided or not formatted properly" }) 
        const team = await db.collections.teams.findOne({ tid })
        if(team === undefined) return res.status(400).json({ success: false, message: "Team does not exist" })

        const user = await db.collections.profiles.findOne({ uid })
        if(user === undefined) return res.status(400).json({ success: false, message: "User does not exist" })

        const invite = await db.collections.invites.findOne({ uid, tid })
        if(invite === undefined) return res.status(400).json({ success: false, message: "Invite does not exist" })

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
        if(isManager === false) return res.status(400).json({ success: false, message: "You are not authorized to cancel invites for this team!" })
            
        await db.collections.invites.deleteOne({ uid, tid })

        res.status(200).json({ success: true, message: "Invite cancelled" })
    })
    return {
        method: "POST",
        route: "/api/v1/team/invite/cancel"
    }
}