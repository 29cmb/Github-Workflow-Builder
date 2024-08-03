const db = require("../modules/db.js");
const { encrypt } = require("../modules/encrypt.js");
const { redirectIfAuth } = require("../modules/middleware.js");
module.exports = (app) => {
    app.post("/api/v1/user/signup", redirectIfAuth, async (req, res) => {
        const { email, username, password } = req.body
        if(
            email == undefined
            || username == undefined 
            || password == undefined
            || typeof username != "string"
            || typeof password != "string"
            || typeof email != "string"
        ) return res.status(400).json({ success: false, message: "Username or password not provided or not formatted properly" }) // im sorry but did I just type a semicolon
        if(username.length < 3) return res.status(400).json({ success: false, message: "Username must be at least 3 characters" })
        if(password.length < 6) return res.status(400).json({ success: false, message: "Password must be at least 6 characters" })
            
        await db.client.connect()
        const user = await db.collections.credentials.findOne({ username: username })
        const otherUser = await db.collections.credentials.findOne({ email })
        if(user != undefined || otherUser != undefined) return res.status(400).json({ success: false, message: "User is already registered" })
        const uid = (await db.collections.credentials.countDocuments()) + 1

        await db.collections.credentials.insertOne({
            email,
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