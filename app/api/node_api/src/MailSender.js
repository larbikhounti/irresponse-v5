var request = require('request');
    
   const sendMail  = (header, body, token) => {
   
        var encodedMail = Buffer.from(
            `${header}` + "\n\n\n\n" +
    
            `${body}`
        ).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
    
     return    request({
                method: "POST",
                uri: "https://www.googleapis.com/gmail/v1/users/me/messages/send",
                headers: {
                    "Authorization": "Bearer  " + token.access_token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "raw": encodedMail
                })
            },
            function (err, response, body) {
                if (err) {
                    return err; // Failure
    
                } else {
                    return body; // Success!
    
                }
            });
    }




module.exports  = {sendMail};