const db = require("../modules/db");
const { readRateLimit } = require("../modules/middleware");
module.exports = (app) => {
    app.get("/api/v1/teams/invite/:iid", readRateLimit, async (req, res) => {
        var { iid } = req.params
        if(iid == undefined) return res.status(400).json({ success: false, message: "IID not provided or not formatted properly" })
        const invite = await db.collections.invites.findOne({ iid })
        if(invite == undefined) return res.status(400).json({ success: false, message: "Invite does not exist." })
        res.status(200).json({ success: true, invite })
    })
    return {
        method: "GET",
        route: "/api/v1/teams/invite/:iid"
    }
}