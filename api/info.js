const db = require("../modules/db.js");
const { authNeeded } = require("../modules/middleware.js");

module.exports = (app) => {
    app.get("/api/v1/user/info", authNeeded, async(req, res) => {
        await db.client.connect()
        const user = await db.collections.profiles.findOne({ uid: req.session.user })
        if(user == undefined) return res.status(400).json({ success: false, message: "User not found."})
        res.status(200).json({ success: true, user })
        await db.client.close()
    });

    return {
        method: "GET",
        route: "/api/v1/user/info"
    }
}