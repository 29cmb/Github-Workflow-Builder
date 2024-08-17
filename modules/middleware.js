const { default: rateLimit } = require("express-rate-limit")

module.exports = {
    authNeeded: (req, res, next) => {
        if(req.session && req.session.user != undefined){
            next()
        } else {
            res.status(400).json({ success: false, message: "You are not logged in." })
        }
    },
    redirectIfAuth: (req, res, next) => {
        if(req.session && req.session.user != undefined){
            res.status(400).json({ success: false, message: "You are already logged in." })
        } else {
            next()
        }
    },
    readRateLimit: rateLimit({
        windowMs: 60 * 1000,
        max: 120,
        message: { success: false, message: "You are being rate limited." }
    }),
    writeRateLimit: rateLimit({
        windowMs: 5 * 60 * 1000,
        max: 10,
        message: { success: false, message: "You are being rate limited." }
    })
}