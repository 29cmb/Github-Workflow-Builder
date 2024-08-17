const db = require("../modules/db.js");
const { readRateLimit } = require("../modules/middleware.js");

module.exports = (app) => {
    app.get("/api/v1/user/info", readRateLimit, async(req, res) => {
        if(req.session.user === undefined) return res.status(400).json({ success: false, message: "You are not logged in."})
        try {
            const user = await db.collections.profiles.findOne({ uid: req.session.user })
            if(user === undefined) return res.status(400).json({ success: false, message: "User not found."})
            res.status(200).json({ success: true, user })
        }catch(e){
            console.log("Error:", e)
            res.status(500).json({ success: false, message: "Internal server error."})
        }
    });

    return {
        method: "GET",
        route: "/api/v1/user/info"
    }
}