const db = require("../modules/db")
const { authNeeded } = require("../modules/middleware")
const limits = require("../config/limits.json")

module.exports = (app) => {
    app.post("/api/v1/teams/new", authNeeded, async (req, res) => {
        await db.client.connect()
        const teams = await db.collections.teams.find({ uid: req.session.uid }).toArray() || []
        if(teams.length > limits.teamsLimit) return res.status(400).json({ success: false, message: "You've reached the limit of allowed teams!" })

        const { name, description } = req.body
        if(
            name == undefined 
            || description == undefined
            || typeof name != "string" 
            || typeof description != "string"
        ) return res.status(400).json({ success: false, message: "Name or description not provided or not formatted properly" })

        await db.collections.teams.insertOne({
            tid: (await db.collections.projects.countDocuments()) + 1,
            oid: req.session.uid,
            members: []
        })

        res.status(200).json({ success: false, message: "Team has been created successfully!" })
        await db.client.close()
    })
    
    return {
        method: "POST",
        route: "/api/v1/teams/new"
    }
}