const db = require("../modules/db")
const { authNeeded, writeRateLimit } = require("../modules/middleware")

module.exports = (app) => {
    app.post("/api/v1/teams/edit", authNeeded, writeRateLimit, async (req, res) => {
        var { tid, name, description } = req.body
        if(
            tid === undefined 
            || name === undefined 
            || description === undefined 
            || typeof tid != "number" 
            || typeof name != "string" 
            || typeof description != "string"
        ) return res.status(400).json({ success: false, message: "TID, name, or description not provided or not formatted properly."})
        const team = await db.collections.teams.findOne({ tid })
        if(team === undefined) return res.status(400).json({ success: false, message: "Team does not exist" })
            
        if(name === "") name = team.name
        if(description === "") description = team.description

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

        if(isManager === false) return res.status(400).json({ success: false, message: "You are not authorized to edit this team!" })

        await db.collections.teams.updateOne({ tid }, {"$set": { name, description }})
        res.status(200).json({ success: true, message: "Team has been updated successfully" })
    })
    return {
        method: "POST",
        route: "/api/v1/teams/edit"
    }
}