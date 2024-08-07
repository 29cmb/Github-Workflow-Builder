const db = require("../modules/db");
const { authNeeded, writeRateLimit } = require("../modules/middleware");

module.exports = (app) => {
    app.post("/api/v1/user/profile/update", authNeeded, writeRateLimit, async (req, res) => {
        var { bio } = req.body
        const profile = await db.collections.profiles.findOne({ uid: req.session.user })
        if(profile == undefined) return res.status(400).json({ success: false, message: "You are not logged in."})
        if(bio == undefined) return res.status(400).json({ success: false, message: "No data provided."}) 
        // for if I ever add more profile stuff
        if(bio == undefined) bio = profile.bio

        await db.collections.profiles.updateOne({ uid: req.session.user }, { $set: { bio }})
        res.status(200).json({ success: true, message: "Profile updated successfully" })
    })
    return {
        method: "POST",
        route: "/api/v1/user/profile/update"
    }
}