const db = require("../modules/db")
const { authNeeded } = require("../modules/middleware")

module.exports = (app) => {
    app.post("/api/v1/projects", authNeeded, async (req, res) => {
        const uid = req.session.user
        if(!uid) return res.status(400).json({ success: false, message: "Not logged in" });
        const projects = await db.collections.projects.find({ uid }).toArray()
        res.status(200).json({ success: true, projects: (projects || []) })
    })

    return {
        method: "POST",
        route: "/api/v1/projects"
    }
}