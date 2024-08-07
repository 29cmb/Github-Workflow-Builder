const { writeRateLimit } = require("../modules/middleware")

module.exports = (app) => {
    app.post("/api/v1/user/logout", writeRateLimit, (req, res) => {
        if(req.session == undefined) return res.status(400).json({ success: false, message: "You are not logged in" })
        return req.session.destroy(function(){
            return res.status(200).json({ success: true, message: "Logged out" })
        })
    })
    return {
        method: "POST",
        route: "/api/v1/user/logout"
    }
}