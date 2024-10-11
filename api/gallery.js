const { readRateLimit } = require("../modules/middleware");
const db = require("../modules/db.js")
module.exports = (app) => {
    app.get("/api/v1/gallery", readRateLimit, async (req, res) => {
        var projects = await db.collections.projects.find({ public: true }).toArray()

        projects = await Promise.all(projects.map(async proj => {
            switch (proj.creator.type) {
                case "user": {
                    const user = await db.collections.profiles.findOne({ uid: proj.creator.id });
                    proj.creator.name = user ? user.username : "Unknown";
                    break;
                }
                case "team": {
                    const team = await db.collections.teams.findOne({ tid: proj.creator.id }); 
                    proj.creator.name = team ? team.name : "Unknown";
                    break;
                }
                default:
                    proj.creator.name = "Unknown";
                    break;
            }
            return proj;
        }));
        
        res.json({ success: true, projects })
    })

    return {
        method: "GET",
        route: "/api/v1/gallery"
    }
}