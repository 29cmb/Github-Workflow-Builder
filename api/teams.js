const db = require("../modules/db")
const { authNeeded } = require("../modules/middleware")

module.exports = (app) => {
    app.post("/api/v1/user/teams", authNeeded, async (req, res) => {
        const uid = req.session.user
        await db.client.connect()
        const teams = db.collections.teams.find({ members: { $in: [uid] } }).toArray() || []
        res.status(200).json({ success: true, teams })
        await db.client.close()
    })

    return {
        method: "POST",
        route: "/api/v1/user/teams"
    }
}