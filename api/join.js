const db = require("../modules/db")
const { authNeeded } = require("../modules/middleware")

module.exports = (app) => {
    app.post("/api/v1/teams/join", authNeeded, async (req, res) => {
        await db.client.connect()
        const { iid } = req.body
        if(iid == undefined || typeof iid != "string") return res.status(400).json({ success: false, message: "TID is invalid or not formatted properly" })
        const invite = await db.collections.invites.findOne({ iid })
        if(invite == undefined) return res.status(400).json({ success: false, message: "Invite does not exist" })
        if(invite.expiration < Date.now()) return res.status(400).json({ success: false, message: "Invite has expired" })
        if(invite.uid != req.session.user) return res.status(400).json({ success: false, message: "This invite isn't for you!" })

        await db.collections.teams.updateOne({ tid: invite.tid }, { $push: {
                members: invite.uid,
                "roles.$[role].users": invite.uid
            }},{
                arrayFilters: [{ "role.name": "Member" }]
            }
        )
        await db.collections.invites.deleteOne({ tid })

        await db.client.close()
    })
    return {
        method: "POST",
        route: "/api/v1/teams/join"
    }
}