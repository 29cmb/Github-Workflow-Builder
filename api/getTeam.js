const db = require("../modules/db")
const { readRateLimit } = require("../modules/middleware")

module.exports = (app) => {
    app.get("/api/v1/teams/:tid/get/", readRateLimit, async (req, res) => {
        var { tid } = req.params
        if(tid === undefined || typeof(parseInt(tid)) != "number") return res.status(400).json({ success: false, message: "TID not provided or not formatted properly." })
        tid = parseInt(tid)
        const team = await db.collections.teams.findOne({ tid })
        if(team === undefined) return res.status(400).json({ success: false, message: "Team does not exist" })
        
        res.status({ success: true, team })
    })
    return {
        method: "GET",
        route: "/api/v1/teams/:tid/get"
    }
}