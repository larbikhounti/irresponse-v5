var request = require('request');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).parse()

let token = "ya29.a0Ad52N38sAVEAjU0XhU5pvxpi2CWZciWiEY3QGjjEOA7EOy8KZqSGRNLPoPlj9uA3vRbcFXRELbHONqzVvGLmK5Nqq2cLNfUC4bZ8wWl2bsqBIyoNWcx7CNqyhB7KBEgrRB44GYJFuKD76zcUB5y8kHqsCpG4oTmbDzy7aCgYKAU8SARESFQHGX2MileWUSkeMF-sJ07a-2q0QTw0171"

let parameters = JSON.parse(Buffer.from(argv.parameters, 'base64').toString('utf-8')) 
  
  // Base64-encode the mail and make it URL-safe 
  // (replace all "+" with "-" and all "/" with "_")
  var encodedMail = new Buffer(
        "Content-Type: text/plain; charset=\"UTF-8\"\n" +
        "MIME-Version: 1.0\n" +
        "Content-Transfer-Encoding: 7bit\n" +
        `to: ${argv.email}\n` +
        "from: larbikhounti@gmail.com\n" +
        "subject: test\n\n" +

        `${parameters.parameters.body}`
  ).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');

  request({
      method: "POST",
      uri: "https://www.googleapis.com/gmail/v1/users/me/messages/send",
      headers: {
        "Authorization": "Bearer  "+ token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "raw": encodedMail
      })
    },
    function(err, response, body) {
      if(err){
        console.log(err); // Failure
     
      } else {
        console.log(body); // Success!
      
      }
    });
