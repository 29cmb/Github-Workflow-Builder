const db = require("../modules/db.js");

module.exports = (app) => {
    app.get("/api/v1/user/info", async(req, res) => {
        try {
            await db.client.connect()
            const user = await db.collections.profiles.findOne({ uid: req.session.user })
            if(user == undefined) return res.status(400).json({ success: false, message: "User not found."})
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