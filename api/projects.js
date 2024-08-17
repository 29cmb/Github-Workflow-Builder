const db = require("../modules/db")
const { authNeeded, readRateLimit } = require("../modules/middleware")

module.exports = (app) => {
    app.post("/api/v1/user/projects/get", authNeeded, readRateLimit, async (req, res) => {
        var { user } = req.body
        if(((user === undefined || typeof user != "number") && req.session.user != undefined)) user = req.session.user
        if(user === undefined) return res.status(400).json({ success: false, message: "User not provided or not formatted properly" })

        const userTeams = await db.collections.teams.find({ members: { $in: [user] } }).toArray()
        const teamIds = userTeams.map(team => team.tid)

        var projects = undefined
        if(req.session.user === user){
            projects = await db.collections.projects.find({
                $or: [
                    { 'creator.type': "user", 'creator.id': user },
                    { 'creator.type': "team", 'creator.id': { $in: teamIds } }
                ]
            }).toArray()
        } else {
            projects = await db.collections.projects.find({
                $or: [
                    { 'creator.type': "user", 'creator.id': user, public: true },
                    { 'creator.type': "team", 'creator.id': { $in: teamIds }, public: true }
                ]
            }).toArray()
        }

        projects = await Promise.all(projects.map(async proj => {
            switch (proj.creator.type) {
                case "user":
                    const user = await db.collections.profiles.findOne({ uid: proj.creator.id });
                    proj.creator.name = user ? user.username : "Unknown";
                    break;
                case "team":
                    const team = await db.collections.teams.findOne({ tid: proj.creator.id }); 
                    proj.creator.name = team ? team.name : "Unknown";
                    break;
                default:
                    proj.creator.name = "Unknown";
                    break;
            }
            return proj;
        }));
        
        res.status(200).json({ success: true, projects: (projects || []) })
    })

    return {
        method: "POST",
        route: "/api/v1/user/projects/get"
    }
}