const db = require("../modules/db")
const { authNeeded } = require("../modules/middleware")
const limits = require("../config/limits.json")

module.exports = (app) => {
    app.post("/api/v1/teams/projects/new", authNeeded, async (req, res) => {
        await db.client.connect() 
        const { tid, name, description } = req.body
        if(
            tid == undefined
            || name == undefined 
            || description == undefined 
            || typeof tid != "number"
            || typeof name != "string" 
            || typeof description != "string"
        ) return res.status(400).json({ success: false, message: "Name or description not provided or not formatted properly" })

        const team = await db.collections.teams.findOne({ tid })
        if(team == undefined) return res.status(400).json({ success: false, message: "Team does not exist"})
        if(!(req.session.uid in team.members.toArray())) return res.status(400).json({ success: false, message: "You are not allowed to make projects for that team." })

        const projects = await db.collections.projects.find({ owner: { type: "team", id: tid } }).toArray() || []
        if(projects.length >= limits.projectsLimit) return res.status(400).json({ success: false, message: "You've reached the limit of allowed projects!" })
       
        await db.collections.projects.insertOne({
            pid: (await db.collections.projects.countDocuments()) + 1,
            creator: { type: "team", id: tid },
            name,
            description
        })

        await db.client.close()

        res.status(200).json({ success: true, message: "New team project created successfully!" })
    })
    return {
        method: "POST",
        route: "/api/v1/projects/new"
    }
}