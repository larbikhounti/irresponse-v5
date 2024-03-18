const {
    sendMail
} = require('./MailSender')
const {
    connect
} = require('./dbConnector')
const {
    getDbType,
    getDbConfig,
    getRecipients,
    extractAccountIds,
    replaceTo
} = require('./helpers/utils')

const mailHandler = async (data) => {
    let result;
    switch (data.action) {
        case 'proceedTest':
            // send mail tests
            result = sendTests(data)
            break;

        default:
            //result = data.action
            result = 'northing'
    }
    return result

}

const sendTests = async (data) => {
   
   let headers = [];
    const extractedAccountIds  =  extractAccountIds(data.parameters['selected-vmtas'])
   //let result = await connect(getDbConfig(getDbType(data)),getTokens(extractedAccountIds));

    const testRecipientsList = getRecipients(data.parameters.rcpts);
    testRecipientsList.forEach(recipient => {
       headers.push(replaceTo(data.parameters['headers'],recipient))
        // result.data.rows.forEach(token => {
        //     // manuplate body and header before sending a test
        //     sendMail(header, body, token)
        // });
        
    });
    return headers;
    // result = await connect(getDbConfig(getDbType(data)), stopProcess(data));
}

const getTokens = (extractedAccountIds) => {
    var params = [];
    for(var i = 1; i <= extractedAccountIds.length; i++) {
    params.push('$' + i);
    }
    const query = {
        text: "select access_token from  admin.gmail_users  WHERE id IN (" + params.join(',') + ")" ,
        values: extractedAccountIds,
      }
      return query;
}

// get mail account info
const getMailAccount = () =>{

}

module.exports = {
    mailHandler
}