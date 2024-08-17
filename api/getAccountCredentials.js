const db = require("../modules/db")
const { authNeeded, readRateLimit } = require("../modules/middleware")

module.exports = (app) => {
    app.post("/api/v1/user/credentials", authNeeded, readRateLimit, async(req, res) => {
        try {
            const user = await db.collections.credentials.findOne({ uid: req.session.user })
            if(user === undefined) return res.status(400).json({ success: false, message: "User not found."})
            res.status(200).json({ success: true, user })
        }catch(e){
            console.log("Error:", e)
            res.status(500).json({ success: false, message: "Internal server error."})
        }
    })
    return {
        method: "POST",
        route: "/api/v1/user/credentials"
    }
}
