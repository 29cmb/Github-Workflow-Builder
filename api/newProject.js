const db = require("../modules/db")
const { authNeeded, writeRateLimit } = require("../modules/middleware")
const limits = require("../config/limits.json")

module.exports = (app) => {
    app.post("/api/v1/projects/new", authNeeded, writeRateLimit, async (req, res) => {
        const { name, description, type, tid } = req.body
        if(
            name == undefined 
            || description == undefined
            || type == undefined
            || (type != "user" && type != "team")
            || (type == "team" && tid == undefined)
            || typeof name != "string" 
            || typeof description != "string"
            || typeof type != "string"
            || (type == "team" && typeof tid != "number")
            || name.length < 1
            || description.length < 1
        ) return res.status(400).json({ success: false, message: "Name or description not provided or not formatted properly" })

        const projects = await db.collections.projects.find({ creator: { type, id: type == "user" ? req.session.user : tid } }).toArray() || []
        if(projects.length >= limits.projectsLimit) return res.status(400).json({ success: false, message: "You've reached the limit of allowed projects!" })

        if(type == "team"){
            const team = await db.collections.teams.findOne({ tid })
            if(!team.members.contains(req.session.user)) return res.status(403).json({ success: false, message: "You do not have permission to create a project under this team" })
        }

        const project = {
            pid: (await db.collections.projects.countDocuments()) + 1,
            creator: { type, id: type == "user" ? req.session.user : tid },
            name,
            description,
            data: {
                components: [],
                componentData: []
            },
            contributors: [],
            public: false
        }

        await db.collections.projects.insertOne(project)

        res.status(200).json({ success: true, message: "New project created successfully!", project })
    })
    return {
        method: "POST",
        route: "/api/v1/projects/new"
    }
}