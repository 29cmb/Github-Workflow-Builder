const db = require("../modules/db")

module.exports = (app) => {
    app.get("/api/v1/team/:tid/invites", async (req, res) => {
        var { tid } = req.params
        if(tid === undefined || typeof parseInt(tid) !== "number") return res.status(400).json({ success: false, message: "TID not provided or not formatted properly" })
        tid = parseInt(tid)
    
        const team = await db.collections.teams.findOne({ tid })
        if(team === undefined) return res.status(400).json({ success: false, message: "Team does not exist" })
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

        if(isManager === false) return res.status(400).json({ success: false, message: "You are not authorized to view invites for this team!" })

        var invites = await db.collections.invites.find({ tid }).toArray();
        invites = await Promise.all(invites.map(async (i) => {
            const user = await db.collections.profiles.findOne({ uid: i.uid });
            i.user = user;
            return i;
        }));

        res.status(200).json({ success: true, invites });
    })
    return {
        method: "GET",
        route: "/api/v1/team/:tid/invites"
    }
}