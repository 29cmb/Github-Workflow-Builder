// Modules
const express = require("express")
require("dotenv").config()
const session = require("express-session")
const sessionSave = require("connect-mongodb-session")(session)
const path = require("path")
const fs = require("fs")
const db = require("./modules/db.js")
const logging = require("./config/logging.json")
const rateLimit = require("express-rate-limit")

// Methods
const app = express()
db.init()
app.set("trust proxy", 1)
app.use(session({
    secret: process.env.COOKIE_SIGNING_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new sessionSave({
        uri: db.uri,
        databaseName: process.env.USERSDATABASE,
        collection: process.env.SESSIONSCOLLECTION
    })
}))

app.use(express.json())
const apiPath = path.join(__dirname, "api")
const apiFiles = fs.readdirSync(apiPath).filter(file => file.endsWith('.js'))

for (const file of apiFiles) {
    const filePath = path.join(apiPath, file)
    const data = require(filePath)(app)
    if(logging.logRouteSetup){
        if(data && data.method && data.route){
            console.log(`✅ | API route ${data.method} '${data.route}' has been setup successfully!`)
        } else {
            console.log(`❌ | API route '${filePath}' did not return data.method or did not return data.route.`)
        }
    }
}

// app.use(express.static(path.join(__dirname, "views")))
app.listen(process.env.PORT || 3000, () => {
    console.log(`✅ | Backend express server has started on port ${process.env.PORT || 3000}.`)
})