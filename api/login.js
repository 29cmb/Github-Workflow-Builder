const db = require("../modules/db.js");
const { decrypt } = require("../modules/encrypt.js");

module.exports = (app) => {
    app.post("/login", async (req, res) => {
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

        if((await decrypt(user.password)) !== body.password) {
            return res.status(400).json({ success: false, message: "Username or password is incorrect" });
        }

        // TODO: Sessions

        res.status(200).json({ success: true, message: "You have logged in successfully" });
    });

    return {
        method: "POST",
        route: "/login"
    }
}