const request = require('request');
const {updateAccessToken} = require("../helpers/utils.js")
const logger = require("../logger/logger.js");

const refresh =  (client_secret, refresh_token, client_id, user_id) =>{
    const options = {
        url: 'https://oauth2.googleapis.com/token',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        form: {
          client_secret: client_secret,
          grant_type: 'refresh_token',
          refresh_token: refresh_token,
          client_id: client_id
        }
      };
      
    request(options,async (error, response, body) => {
        if (!error && response.statusCode == 200) {
           console.log(JSON.parse(body).access_token)
          let result  = await updateAccessToken(JSON.parse(body).access_token,user_id)
          logger.log({ level: "info", message: result});
        } else {
            console.log(error)
        }
      });
    
}
//refresh('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','1//03Z29p1ePtNtdCgYIARAAGAMSNwF-L9Ir6hTZztF-D_mQ-R-qBoWUsxK0snueGs42lyj0Bdyck8dfSt-iKS_fP4M47kAWAX10iW0','607111266227-5dlshfll09u09hkhfcmkaole9k9nfbvf.apps.googleusercontent.com')


module.exports = {refresh}

