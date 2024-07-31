const db = require("../modules/db.js");
const { encrypt } = require("../modules/encrypt.js");
module.exports = (app) => {
    app.post("/signup", async (req, res) => {
        const { body } = req
        if(
            body == undefined 
            || body.username == undefined 
            || body.password == undefined
            || typeof body.username != "string"
            || typeof body.password != "string"
        ) return res.status(400).json({ success: false, message: "Username or password not provided or not formatted properly" }) // im sorry but did I just type a semicolon

        await db.client.connect()
        const user = await db.collections.credentials.findOne({ username: body.username })
        if(user) return res.status(400).json({ success: false, message: "User is already registered" })

        await db.collections.credentials.insertOne({
            uid: (await db.collections.credentials.countDocuments()) + 1,
            username: body.username,
            password: (await encrypt(body.password)),
        })

        res.status(200).json({ success: true, message: "You have signed up successfully" })
    }) 

    return {
        method: "POST",
        route: "/signup"
    }
}