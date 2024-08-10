const mailjet = require('node-mailjet');
var connection;

module.exports = {
    async connect() {
        connection = mailjet.apiConnect(process.env.MAILJET_API_KEY, process.env.MAILJET_PRIVATE_KEY);
        console.log("📨 | MailJet Server Connection has been established");
    },
    async send(to, subject, text, html) {
        if (connection == undefined) await this.connect();
        const request = connection.post("send", { 'version': 'v3.1' }).request({
            "Messages": [
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
        });

        request
            .then((result) => {
                console.log(`📨 | Mail sent successfully to ${to}!`);
            })
            .catch((err) => {
                console.error('Error:', err.statusCode, err.statusText);
                console.error('Original Message:', err.originalMessage);
                console.error('Response Data:', err.response.data);
                if (err.response && err.response.data && err.response.data.Messages) {
                    err.response.data.Messages.forEach(message => {
                        console.error('Message Status:', message.Status);
                        if (message.Errors) {
                            message.Errors.forEach(error => {
                                console.error('Error Code:', error.ErrorCode);
                                console.error('Error Message:', error.ErrorMessage);
                            });
                        }
                    });
                }
            });
    }
}