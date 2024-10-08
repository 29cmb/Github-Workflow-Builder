const db = require("../modules/db")
const { readRateLimit } = require("../modules/middleware")

module.exports = (app) => {
    app.get("/api/v1/teams/:tid/members", readRateLimit, async (req, res) => {
        var { tid } = req.params
        if(tid === undefined || typeof(parseInt(tid)) !== "number") return res.status(400).json({ success: false, message: "TID not provided or not formatted properly." })
        tid = parseInt(tid)
        const team = await db.collections.teams.findOne({ tid })
        if(team === undefined) return res.status(400).json({ success: false, message: "Team does not exist." })
        var members = await db.collections.profiles.find({ uid: { "$in": team.members } }).toArray()
        members = members.map(member => {
            const rank = team.roles.find(role => role.users.includes(member.uid))?.rank || 1;
            return { ...member, rank };
        });
        res.status(200).json({ success: true, members })
    })
    return {
        method: "GET",
        route: "/api/v1/teams/:tid/members"
    }
}