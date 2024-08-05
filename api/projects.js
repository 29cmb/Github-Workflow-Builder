const db = require("../modules/db")
const { authNeeded } = require("../modules/middleware")

module.exports = (app) => {
    app.post("/api/v1/user/projects/get", authNeeded, async (req, res) => {
        var { user } = req.body
        if(((user == undefined || typeof user != "number") && req.session.id != undefined)) user = req.session.id
        if(user == undefined) return res.status(400).json({ success: false, message: "User not provided or not formatted properly" })

        const userTeams = await db.collections.teams.find({ members: { $in: [user] } }).toArray()
        const teamIds = userTeams.map(team => team.tid)

        var projects = undefined
        if(req.session.user == user){
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
        
        res.status(200).json({ success: true, projects: (projects || []) })
    })

    return {
        method: "POST",
        route: "/api/v1/user/projects/get"
    }
}