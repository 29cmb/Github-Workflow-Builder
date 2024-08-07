const db = require("../modules/db")
const { authNeeded, readRateLimit } = require("../modules/middleware")

module.exports = (app) => {
    app.get("/api/v1/user/teams", authNeeded, readRateLimit, async (req, res) => {
        const teams = await db.collections.teams.find({ members: { $in: [req.session.user] } }).toArray() || []
        await Promise.all(teams.map(async team => {
            const owner = await db.collections.profiles.findOne({ uid: team.oid })
            if(owner == undefined) return
            team.owner = owner.username

            team.role = 'Member';
            team.roles.forEach(role => {
                if (role.users.includes(req.session.user)) {
                    team.role = role.name;
                }
            });
        }));
        
        res.status(200).json({ success: true, teams })
    })

    return {
        method: "GET",
        route: "/api/v1/user/teams"
    }
}