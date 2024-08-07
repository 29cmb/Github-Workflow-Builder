const db = require("../modules/db")
const { readRateLimit } = require("../modules/middleware")

module.exports = (app) => {
    app.get("/api/v1/user/:uid/get", readRateLimit, async(req, res) => {
        var { uid } = req.params
        if(uid == undefined || typeof(parseInt(tid)) != "number") return res.status(400).json({ sucess: false, message: "UID not provided or not formatted properly" })
        uid = parseInt(uid)
        const user = await db.collections.profiles.findOne({ uid })
        if(user == undefined) return res.status(400).json({ success: false, message: "User not found."})
        res.status(200).json({ success: true, user })
    })
    return {
        method: "GET",
        route: "/api/v1/user/:uid/get"
    }
}