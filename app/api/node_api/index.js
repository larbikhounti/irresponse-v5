var request = require('request');
let token = "ya29.a0Ad52N38lejAK3Y6yWiwTkobgoRf0sgVvCWldwBjMWt7v093VWVNkSwP-g6QBHvqjJXzAkdqNjctlZHwJOyK-XWrHHwGYD0xcfD6tQlnUrqMhmTHZv5p7ACXZXGoeFcGY5WG_xcbefr0dxUokxgfQzNb6cUBqF6omwMSNaCgYKAacSARESFQHGX2MiI289fjMKdgXrTkLdwLOffw0171"

  // Base64-encode the mail and make it URL-safe 
  // (replace all "+" with "-" and all "/" with "_")
  var encodedMail = new Buffer(
        "Content-Type: text/plain; charset=\"UTF-8\"\n" +
        "MIME-Version: 1.0\n" +
        "Content-Transfer-Encoding: 7bit\n" +
        "to: howin34374@azduan.com\n" +
        "from: larbikhounti@gmail.com\n" +
        "subject: test\n\n" +

        "this is a test for api"
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
