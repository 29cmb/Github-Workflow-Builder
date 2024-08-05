const db = require("../modules/db")
const { authNeeded } = require("../modules/middleware")

module.exports = (app) => {
    app.get("/api/v1/user/teams", authNeeded, async (req, res) => {
        const uid = req.session.user
        const teams = await db.collections.teams.find({ members: { $in: [uid] } }).toArray() || []
        res.status(200).json({ success: true, teams })
    })

    return {
        method: "GET",
        route: "/api/v1/user/teams"
    }
}