const db = require("../modules/db")
const migration = require("../modules/migration")
const { projectSchemaVersion } = require("../config/schema.json")
const { writeRateLimit } = require("../modules/middleware")

module.exports = (app) => {
    app.post("/api/v1/migrate", writeRateLimit, async (req, res) => {
        const { pid } = req.body
        if(pid === undefined || typeof pid !== "number") return res.status(400).json({ success: false, message: "Project ID not provided or not formatted properly" })
    
        const project = await db.collections.projects.findOne({ pid })
        if(project == undefined || project == null) return res.status(404).json({ success: false, message: "Project not found" })
        if(project.schemaVersion == projectSchemaVersion) return res.status(500).json({ success: false, message: "Project is already on the latest schema version" })
    
        await migration.migrateProject(pid)
    
        res.status(200).json({ success: true, message: "Project migrated successfully!" })
    })
    return {
        method: "POST",
        route: "/api/v1/migrate"
    }
}