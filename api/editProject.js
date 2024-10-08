const db = require("../modules/db")
const { authNeeded, writeRateLimit } = require("../modules/middleware")

module.exports = (app) => {
    app.post("/api/v1/projects/edit", authNeeded, writeRateLimit, async (req, res) => {
        const { pid, name, description } = req.body
        if(
            pid === undefined 
            || name === undefined
            || description === undefined
            || typeof pid !== "number" 
            || typeof name !== "string"
            || typeof description !== "string"
        ) return res.status(400).json({ success: false, message: "PID, Name, or Description not provided or not formatted properly" })

        const project = await db.collections.projects.findOne({ pid })
        switch(project.owner.type){
            case "user":
                if(req.session.user !== project.owner.id && !(req.session.user in project.contributors)) return res.status(403).json({ success: false, message: "You do not have permissions to write to this project" })
                break;
            case "team":
                const team = await db.collections.teams.findOne({ tid: project.owner.id })
                if(!team.members.includes(req.session.user)) return res.status(403).json({ success: false, message: "You do not have permissions to write to this project" })
        }

        await db.collections.projects.updateOne({ pid }, {"$set": { name, description }})

        res.status(200).json({ success: true, message: "Project details have been saved successfully" })
    })
    return {
        method: "POST",
        route: "/api/v1/projects/edit"
    }
}