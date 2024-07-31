const db = require("../modules/db.js");
const { decrypt } = require("../modules/encrypt.js");
const { redirectIfAuth } = require("../modules/middleware.js");

module.exports = (app) => {
    app.post("/api/v1/user/login", redirectIfAuth, async (req, res) => {
        const { body } = req
        if(
            body == undefined 
            || body.username == undefined 
            || body.password == undefined
            || typeof body.username != "string"
            || typeof body.password != "string"
        ) return res.status(400).json({ success: false, message: "Username or password not provided or not formatted properly" });

        await db.client.connect()
        const user = await db.collections.credentials.findOne({ username: body.username });
        if(!user) return res.status(400).json({ success: false, message: "Username or password is incorrect" });

        if(decrypt(user.password) !== body.password) return res.status(400).json({ success: false, message: "Username or password is incorrect" });
        
        req.session.authorized = true
        req.session.user = user.uid

        res.status(200).json({ success: true, message: "You have logged in successfully" });
        await db.client.close()
    });

    return {
        method: "POST",
        route: "/api/v1/user/login"
    }
}