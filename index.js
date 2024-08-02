// Modules
const express = require("express")
require("dotenv").config()
const session = require("express-session")
const sessionSave = require("connect-mongodb-session")(session)
const path = require("path")
const fs = require("fs")
const db = require("./modules/db.js")
const { authNeeded, redirectIfAuth } = require("./modules/middleware.js")
const middlewareConfig = require("./config/middlewareConfig.json")
const logging = require("./config/logging.json")

// Methods
const app = express()
db.init()

middlewareConfig.AuthNeeded.forEach(route => {
    app.get(route, authNeeded)
})

middlewareConfig.RedirectIfAuth.forEach(route => {
    app.get(route, redirectIfAuth)
})

const apiPath = path.join(__dirname, "api")
const apiFiles = fs.readdirSync(apiPath).filter(file => file.endsWith('.js'))

for (const file of apiFiles) {
    const filePath = path.join(apiPath, file)
    const data = require(filePath)(app)
    if(logging.logRouteSetup){
        if(data.method && data.route){
            console.log(`✅ | API route ${data.method} '${data.route}' has been setup successfully!`)
        } else {
            console.log(`❌ | API route '${filePath}' did not return data.method or did not return data.route.`)
        }
    }
   
}

app.use(express.json())
app.use(session({
    secret: process.env.COOKIE_SIGNING_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new sessionSave({
        uri: db.uri,
        collection: process.env.SESSIONSCOLLECTION
    })
}))
app.use(express.static(path.join(__dirname, "views")))
app.listen(process.env.PORT || 3000, () => {
    console.log("✅ | Backend express server has started.")
})