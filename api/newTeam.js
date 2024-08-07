const db = require("../modules/db")
const { authNeeded, writeRateLimit } = require("../modules/middleware")
const limits = require("../config/limits.json")

module.exports = (app) => {
    app.post("/api/v1/teams/new", authNeeded, writeRateLimit, async (req, res) => {
        const teams = await db.collections.teams.find({ oid: req.session.user }).toArray() || []
        if(teams.length >= limits.teamsLimit) return res.status(400).json({ success: false, message: "You've reached the limit of allowed teams!" })

        const { name, description } = req.body
        if(
            name == undefined 
            || description == undefined
            || typeof name != "string" 
            || typeof description != "string"
            || name.length < 1
            || description.length < 1
        ) return res.status(400).json({ success: false, message: "Name or description not provided or not formatted properly" })

        await db.collections.teams.insertOne({
            tid: (await db.collections.teams.countDocuments()) + 1,
            oid: req.session.user,
            name,
            description,
            members: [ req.session.user ],
            roles: [
                {name: "Owner", rank: 3, users: [ req.session.user ]},
                {name: "Manager", rank: 2, users: []},
                {name: "Member", rank: 1, users: []}
            ]
        })

        res.status(200).json({ success: true, message: "Team has been created successfully!" })
    })
    
    return {
        method: "POST",
        route: "/api/v1/teams/new"
    }
}