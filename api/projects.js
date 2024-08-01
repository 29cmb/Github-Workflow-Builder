const db = require("../modules/db")
const { authNeeded } = require("../modules/middleware")

module.exports = (app) => {
    app.post("/api/v1/projects/get", async (req, res) => {
        await db.client.connect()
        var { user } = req.body
        if(((user == undefined || typeof user != "number") && req.session.id != undefined)) user = req.session.id
        if(user == undefined) res.status(400).json({ success: true, message: "User not provided or not formatted properly" })

        var projects = undefined
        if(req.session.user == user){
            projects = await db.collections.projects.find({ creator: { type: "user", id: user } }).toArray()
        } else {
            projects = await db.collections.projects.find({ creator: { type: "user", id: user }, public: true }).toArray()
        }
        
        await db.client.close()
        res.status(200).json({ success: true, projects: (projects || []) })
    })

    return {
        method: "POST",
        route: "/api/v1/projects/get"
    }
}