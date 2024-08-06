module.exports = (app) => {
    app.post("/api/v1/teams/members", async (req, res) => {
        const { tid } = req.body
        if(tid == undefined || typeof tid != "number") return res.status(400).json({ success: false, message: "TID not provided or not formatted properly." })
        const team = await db.collections.teams.findOne({ tid })
        if(team == undefined) return res.status(400).json({ success: false, message: "Team does not exist." })
        const members = await db.collections.profiles.find({ uid: { "$in": team.members } }).toArray()
        res.status(200).json({ success: true, members })
    })
    return {
        method: "POST",
        route: "/api/v1/teams/members"
    }
}