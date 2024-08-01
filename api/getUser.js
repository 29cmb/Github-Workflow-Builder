const db = require("../modules/db")

module.exports = (app) => {
    app.post("/api/v1/user/get", async(req, res) => {
        await db.client.connect()

        await db.client.close()
    })
    return {
        method: "POST",
        route: "/api/v1/user/get"
    }
}