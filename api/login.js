const db = require("../modules/db.js");
const { decrypt } = require("../modules/encrypt.js");
const { redirectIfAuth, writeRateLimit } = require("../modules/middleware.js");

module.exports = (app) => {
    app.post("/api/v1/user/login", redirectIfAuth, writeRateLimit, async (req, res) => {
        const { username, password } = req.body
        if(
            username === undefined 
            || password === undefined
            || typeof username != "string"
            || typeof password != "string"
        ) return res.status(400).json({ success: false, message: "Username or password not provided or not formatted properly" });

        const user = await db.collections.credentials.findOne({ username: username });
        if(!user) return res.status(400).json({ success: false, message: "Username or password is incorrect" });

        if(decrypt(user.password) !== password) return res.status(400).json({ success: false, message: "Username or password is incorrect" });
        
        req.session.authorized = true
        req.session.user = user.uid

        res.status(200).json({ success: true, message: "You have logged in successfully" });
    });

    return {
        method: "POST",
        route: "/api/v1/user/login"
    }
}