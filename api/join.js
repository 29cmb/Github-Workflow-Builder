const db = require("../modules/db")
const { authNeeded, writeRateLimit } = require("../modules/middleware")

module.exports = (app) => {
    app.post("/api/v1/teams/join", authNeeded, writeRateLimit, async (req, res) => {
        const { iid } = req.body
        if(iid === undefined || typeof iid != "string") return res.status(400).json({ success: false, message: "TID is invalid or not formatted properly" })
        const invite = await db.collections.invites.findOne({ iid })
        if(invite === undefined) return res.status(400).json({ success: false, message: "Invite does not exist" })
        if(invite.expiration < Date.now()) return res.status(400).json({ success: false, message: "Invite has expired" })
        if(invite.uid != req.session.user) return res.status(400).json({ success: false, message: "This invite isn't for you!" })
        const team = await db.collections.teams.findOne({ tid: invite.tid })
        if(team === undefined) return res.status(400).json({ success: false, message: "Team does not exist" })
        if(team.members.includes(invite.uid)) return res.status(400).json({ success: false, message: "You are already a member of this team" })

        await db.collections.teams.updateOne({ tid: invite.tid }, { $push: {
                members: invite.uid,
                "roles.$[role].users": invite.uid
            }},{
                arrayFilters: [{ "role.name": "Member" }]
            }
        )
        await db.collections.invites.deleteOne({ iid })
        res.status(200).json({ success: true, message: "Joined successfully"})
    })
    return {
        method: "POST",
        route: "/api/v1/teams/join"
    }
}