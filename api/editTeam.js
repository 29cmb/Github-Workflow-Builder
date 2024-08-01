const db = require("../modules/db")
const { authNeeded } = require("../modules/middleware")

module.exports = (app) => {
    app.post("/api/v1/teams/edit", authNeeded, async (req, res) => {
        await db.client.connect()
        const { tid, name, description } = req.body
        if(
            tid == undefined 
            || name == undefined 
            || description == undefined 
            || typeof tid != "number" 
            || typeof name != "string" 
            || typeof description != "string"
        ) return res.status(400).json({ success: false, message: "TID, name, or description not provided or not formatted properly."})
        const team = await db.collections.teams.findOne({ tid })
        if(team == undefined) return res.status(400).json({ success: false, message: "Team does not exist" })

        var isManager = false
        [2,3].forEach(rnk => {
            team.roles.find(r => r.rank === rnk).users.forEach((u) => {
                if(u == req.session.user){
                    isManager = true
                }
            })
        })

        if(isManager == false) return res.status(400).json({ success: false, message: "You are not authorized to edit this team!" })

        await db.collections.teams.updateOne({ tid }, {"$set": { name, description }})
        await db.client.close()
    })
    return {
        method: "POST",
        route: "/api/v1/teams/edit"
    }
}