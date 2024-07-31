const express = require("express")
const app = express()
require("dotenv").config()
const path = require("path")
const fs = require("fs")
const db = require("./modules/db.js")

app.use(express.json())
app.listen(process.env.PORT || 3000, () => {
    console.log("✅ | Backend express server has started.")
})



const apiPath = path.join(__dirname, "api")
const apiFiles = fs.readdirSync(apiPath).filter(file => file.endsWith('.js'))

for (const file of apiFiles) {
    const filePath = path.join(apiPath, file)
    const data = require(filePath)(app)
    if(data.method && data.route){
        console.log(`✅ | API route ${data.method} '${data.route}' has been setup successfully!`)
    } else {
        console.log(`❌ | API route '${filePath}' did not return data.method or did not return data.route.`)
    }
}


db.run()