const mailjet = require ('node-mailjet')
var connection
module.exports = {
    async connect(){
        connection = await mailjet.connect(process.env.MAILJET_API_KEY, process.env.MAILJET_PRIVATE_KEY)
        console.log("📨 | MailJet Server Connection has been established")
    },
    async send(to, subject, text, html){
        if(connection == undefined) await this.connect()
        connection.post("send", {'version': 'v3.1'}).request({
            "Messages":[
                {
                    "From": {
                        "Email": process.env.MAILJET_EMAIL,
                        "Name": process.env.MAILJET_NAME
                    },
                    "To": [
                        {
                            "Email": to
                        }
                    ],
                    "Subject": subject,
                    "TextPart": text,
                    "HTMLPart": html
                }
            ]
        })
    }
}