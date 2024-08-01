const db = require("../modules/db")
const { authNeeded } = require("../modules/middleware")

module.exports = (app) => {
    app.post("/api/v1/projects/save", authNeeded, async (req, res) => {
        await db.client.connect()
        const { pid, data } = req.body
        if(
            pid == undefined 
            || data == undefined
            || typeof pid != "number" 
            || typeof data != "object" 
            || data.blocks == undefined 
            || typeof data.blocks != "object"
        ) return res.status(400).json({ success: false, message: "PID or Data not provided or not formatted properly." })

        const project = await db.collections.projects.findOne({ pid })
        switch(project.owner.type){
            case "user":
                if(req.session.user != project.owner.id && !(req.session.user in project.contributors)) return res.status(403).json({ success: false, message: "You do not have permissions to write to this project" })
            case "team":
                const team = await db.collections.teams.findOne({ tid: project.owner.id })
                if(!(req.session.user in team)) return res.status(403).json({ success: false, message: "You do not have permissions to write to this project" })
        }

        await db.collections.projects.updateOne({ pid }, {"$set": { data }})
        await db.client.close()
    })
    return {
        method: "POST",
        route: "/api/v1/projects/save"
    }
}