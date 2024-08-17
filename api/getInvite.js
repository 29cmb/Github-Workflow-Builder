const db = require("../modules/db");
const { readRateLimit } = require("../modules/middleware");
module.exports = (app) => {
    app.get("/api/v1/teams/invite/:iid", readRateLimit, async (req, res) => {
        var { iid } = req.params
        if(iid === undefined) return res.status(400).json({ success: false, message: "IID not provided or not formatted properly", code: 0 })
        const invite = await db.collections.invites.findOne({ iid })
        if(invite === undefined) return res.status(400).json({ success: false, message: "Invite does not exist.", code: 1 })
        if(Date.now() > invite.expiration) return res.status(400).json({ success: false, message: "Invite has expired.", code: 2 })
        if(invite.uid !== req.session.user) return res.status(400).json({ success: false, message: "This invite isn't for you", code: 3 })
        const team = await db.collections.teams.findOne({ tid: invite.tid })
        if(team === undefined) return res.status(400).json({ success: false, message: "Team does not exist", code: 4 })
        res.status(200).json({ success: true, invite, team })
    })
    return {
        method: "GET",
        route: "/api/v1/teams/invite/:iid"
    }
}