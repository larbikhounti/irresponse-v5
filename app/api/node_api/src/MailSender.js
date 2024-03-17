var request = require('request');


class MailSender {

    constructor() {} 

    token = "dsjfhdsjkfdsf"
    
    sendMail (data) {
        let decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'))
        var encodedMail = Buffer.from(
            `${decodedData.parameters['headers']}` +
    
            `${decodedData.parameters['body']}`
        ).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
    
        request({
                method: "POST",
                uri: "https://www.googleapis.com/gmail/v1/users/me/messages/send",
                headers: {
                    "Authorization": "Bearer  " + token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "raw": encodedMail
                })
            },
            function (err, response, body) {
                if (err) {
                    console.log(err); // Failure
    
                } else {
                    console.log(body); // Success!
    
                }
            });
    }
}



module.exports  = MailSender;