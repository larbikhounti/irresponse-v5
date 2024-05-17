const request = require('request');
function sendMail(header, body, token) {

const encodedMail = Buffer.from(`${header}\n\n\n\n${body}`)
        .toString("base64")
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

   return  request({
            method: "POST",
            uri: "https://www.googleapis.com/gmail/v1/users/me/messages/send",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "raw": encodedMail
            })
        }, (err, response, body) => {
            if (err) {
                //reject(err); // Failure
        
            } else {
               // resolve(response); // Success
             
               
            }
        });
}
module.exports = sendMail