module.exports = (app) => {
    app.get("/", (req, res) => {
        res.send("Coming soon")
    })
    return {
        method: "GET",
        route: "/"
    }
} 