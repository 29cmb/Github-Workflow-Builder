const db = require("../modules/db")
const { authNeeded } = require("../modules/middleware")
const limits = require("../config/limits.json")

module.exports = (app) => {
    app.post("/api/v1/newProject", authNeeded, async (req, res) => {
        await db.client.connect()
        const projects = await db.collections.projects.find({ uid: req.session.uid }).toArray() || []
        if(projects.length > limits.projectsLimit) return res.status(400).json({ success: false, message: "You've reached the limit of allowed projects!" })

        const { name, description } = req.body
        if(
            name == undefined 
            || description == undefined 
            || typeof name != "string" 
            || typeof description != "string"
        ) return res.status(400).json({ success: false, message: "Name or description not provided or not formatted properly" })

        
    })
    return {
        method: "POST",
        route: "/api/v1/newProject"
    }
}