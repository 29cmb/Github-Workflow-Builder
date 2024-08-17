const db = require("../modules/db");
const { encrypt, decrypt } = require("../modules/encrypt");
const { authNeeded, writeRateLimit } = require("../modules/middleware");

module.exports = (app) => {
    app.post("/api/v1/user/update", authNeeded, writeRateLimit, async (req, res) => {
        var { email, username, password, confirmation } = req.body
        const user = await db.collections.credentials.findOne({ uid: req.session.user })
        if(user === undefined) return res.status(400).json({ success: false, message: "You are not logged in."})
        if(email === undefined && username === undefined && password === undefined) return res.status(400).json({ success: false, message: "No data provided."})
        if(email === undefined || typeof email != "string") email = user.email

        if(username != undefined){
            const otherUser = await db.collections.credentials.findOne({ username })
            if(otherUser != undefined) return res.status(400).json({ success: false, message: "Username is taken." })
        } else {
            username = user.username
        }

        if(username.length < 3) return res.status(400).json({ success: false, message: "Username must be at least 3 characters" });

        if(password != undefined && typeof password === "string"){
            if(password.length < 6) return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
            if(confirmation === undefined || confirmation != decrypt(user.password)) return res.status(400).json({ success: false, message: "You did not provide a valid confirmation"})
            await db.collections.sessions.deleteMany({ "session.user": req.session.user })
        } else {
            password = decrypt(user.password)
        }

        await db.collections.credentials.updateOne({ uid: req.session.user }, { $set: { email, username, password: encrypt(password) }})
        res.status(200).json({ success: true, message: "User updated successfully" })
    })
    return {
        method: "POST",
        route: "/api/v1/user/update"
    }
}