const db = require("../modules/db.js")
const { readRateLimit } = require("../modules/middleware.js")
module.exports = (app) => {
    app.get("/api/v1/user/username/:username", readRateLimit, async (req, res) => {
        const { username } = req.params
        const user = await db.collections.profiles.findOne({ username })
        if(user === undefined) return res.status(400).json({ success: false, message: "User does not exist" })
        return res.json({ success: true, user })
    })
    return {
        method: "POST",
        route: "/api/v1/user/username/:username"
    }
}