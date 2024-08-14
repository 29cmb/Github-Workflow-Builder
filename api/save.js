const db = require("../modules/db")
const { authNeeded, writeRateLimit } = require("../modules/middleware")

module.exports = (app) => {
    app.post("/api/v1/projects/save", authNeeded, writeRateLimit, async (req, res) => {
        const { pid, data } = req.body
        if(
            pid == undefined 
            || data == undefined
            || typeof pid != "number" 
            || typeof data != "object" 
            || data.components == undefined
            || data.componentData == undefined 
            || typeof data.blocks != "object"
            || typeof data.componentData != "object"
        ) return res.status(400).json({ success: false, message: "PID or Data not provided or not formatted properly." })

        const project = await db.collections.projects.findOne({ pid })
        switch(project.owner.type){
            case "user":
                if(req.session.user != project.owner.id && !(project.contributors.includes(req.session.user))) return res.status(403).json({ success: false, message: "You do not have permissions to write to this project" })
            case "team":
                const team = await db.collections.teams.findOne({ tid: project.owner.id })
                if(!team.members.includes(req.session.user)) return res.status(403).json({ success: false, message: "You do not have permissions to write to this project" })
        }

        await db.collections.projects.updateOne({ pid }, {"$set": { data }})
        res.status(200).json({ success: true, message: "Project saved successfully" })
    })
    return {
        method: "POST",
        route: "/api/v1/projects/save"
    }
}