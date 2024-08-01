const db = require("../modules/db")

module.exports = (app) => {
    app.post("/api/v1/user/get", async(req, res) => {
        await db.client.connect()
        const { uid } = req.body
        if(uid == undefined || typeof uid != "number") return res.status(400).json({ sucess: false, message: "UID not provided or not formatted properly" })
        await db.client.close()
    })
    return {
        method: "POST",
        route: "/api/v1/user/get"
    }
}