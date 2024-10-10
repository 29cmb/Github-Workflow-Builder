const { readRateLimit } = require("../modules/middleware")

module.exports = (app) => {
    app.get("/api/v1/schema", readRateLimit, async (req, res) => {
        res.status(200).json(require("../config/schema.json"))
    })
    return {
        method: "GET",
        route: "/api/v1/schema"
    }
}