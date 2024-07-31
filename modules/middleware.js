module.exports = {
    authNeeded: (req, res, next) => {
        if(req.session.authorized == true){
            next()
        } else {
            res.redirect("/login")
        }
    },
    redirectIfAuth: (req, res, next) => {
        if(req.session.authorized == true){
            res.redirect("/dashboard")
        } else {
            next()
        }
    }
}