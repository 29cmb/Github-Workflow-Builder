const db = require("../modules/db")

module.exports = (app) => {
    app.post("/api/v1/teams/get", async (req, res) => {
        await db.client.connect()
        const { tid } = req.body
        if(tid == undefined || typeof tid != "number") return res.status(400).json({ success: false, message: "TID not provided or not formatted properly." })
        const team = await db.collections.teams.findOne({ tid })
        if(team == undefined) return res.status(400).json({ success: false, message: "Team does not exist" })
        
        res.status({ success: true, team })
        await db.client.close()
    })
    return {
        method: "POST",
        route: "/api/v1/teams/get"
    }
}