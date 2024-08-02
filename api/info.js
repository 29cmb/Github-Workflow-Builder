const { authNeeded } = require("../modules/middleware.js");

module.exports = (app) => {
    app.get("/api/v1/user/info", authNeeded, (req, res) => {
        res.json({ success: true, uid: req.session.user })
    });

    return {
        method: "GET",
        route: "/api/v1/user/info"
    }
}