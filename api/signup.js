const db = require("../modules/db.js");
const { encrypt } = require("../modules/encrypt.js");
const { redirectIfAuth } = require("../modules/middleware.js");
module.exports = (app) => {
    app.post("/api/v1/user/signup", redirectIfAuth, async (req, res) => {
        const { username, password } = req.body
        if(
            username == undefined 
            || password == undefined
            || typeof username != "string"
            || typeof password != "string"
        ) return res.status(400).json({ success: false, message: "Username or password not provided or not formatted properly" }) // im sorry but did I just type a semicolon

        await db.client.connect()
        const user = await db.collections.credentials.findOne({ username: username })
        if(user) return res.status(400).json({ success: false, message: "User is already registered" })
        const uid = (await db.collections.credentials.countDocuments()) + 1
        await db.collections.credentials.insertOne({
            uid,
            username,
            password: encrypt(password),
        })

        await db.collections.profiles.insertOne({
            uid,
            username,
            bio: ""
        })

        res.status(200).json({ success: true, message: "You have signed up successfully" })
        await db.client.close()
    }) 

    return {
        method: "POST",
        route: "/api/v1/user/signup"
    }
}