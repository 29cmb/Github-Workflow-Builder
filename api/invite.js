const db = require("../modules/db")
const { authNeeded, writeRateLimit } = require("../modules/middleware")
const { randomBytes } = require("crypto")
const limits = require("../config/limits.json")
const mail = require("../modules/mail")

module.exports = (app) => {
    app.post("/api/v1/teams/invite", authNeeded, writeRateLimit, async (req, res) => {
        const { uid, tid } = req.body
        if(uid == undefined || tid == undefined || typeof uid != "number" || typeof tid != "number") return res.status(400).json({ success: false, message: "UID or TID not provided or not formatted properly" })
        const user = await db.collections.profiles.findOne({ uid })
        const userCreds = await db.collections.credentials.findOne({ uid} )
        if(user == undefined || userCreds == undefined) return res.status(400).json({ success: false, message: "User does not exist." })
        const team = await db.collections.teams.findOne({ tid })
        if(team == undefined) return res.status(400).json({ success: false, message: "Team does not exist." })
        if(team.members.length >= limits.membersLimit) return res.status(400).json({ success: false, message: "Team is full" })
        if(team.members.includes(user.uid)) return res.status(400).json({ success: false, message: "User is already in the team." })
        const invite = await db.collections.invites.findOne({ uid })
        if(invite != undefined && Date.now() < invite.expiration) return res.status(400).json({ success: false, message: "User already has a pending invite" })

        var isManager = false
        if (team.roles && Array.isArray(team.roles)) {
            [2, 3].forEach(rank => {
                const role = team.roles.find(r => r.rank === rank);
                if (role) {
                    role.users.forEach(user => {
                        if (user === req.session.user) {
                            isManager = true;
                        }
                    });
                } else {
                    console.error(`Role with rank ${rank} not found`);
                }
            });
        } else {
            console.error("Roles are not defined or not an array");
        }
        
        if(isManager == false) return res.status(400).json({ success: false, message: "You are not authorized to invite people to this team!" })

        const iid = randomBytes(32).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)
        await db.collections.invites.insertOne({
            iid,
            tid,
            uid,
            expiration: Date.now() + 604800000 // 1 week later
        })

        const myUser = await db.collections.profiles.findOne({ uid: req.session.user }) || {}

        res.status(200).json({ success: true, message: "User has been invited" })
        mail.send(userCreds.email, "Invite", "You have been invited to a team!", mail.templates.invite(team.name, iid, myUser.name || "Unknown User"))
    })
    return {
        method: "POST",
        route: "/api/v1/teams/invite"
    }
}