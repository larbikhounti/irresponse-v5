const {sendMail} = require('./MailSender')
const {connect} = require('./dbConnector')
const {
    getRecipients,
    extractAccountIds,
    replaceTo,
    replaceTagsWithRandom,
    getDbConfig,
    getDbType,
    getDataRecipients
} = require('./helpers/utils')
const mailHandler = async (data) => {
    let result;
    switch (data.action) {
        case 'proceedTest':
            // send mail tests
            result = sendTests(data)
            break;
        case 'proceedDrop':
            // send mail tests
            result = sendDrop(data)
            break;
        default:
            //result = data.action
            result = 'northing'
    }
    return result

}

const sendTests = async (data) => {
   let results = [];
    const extractedAccountIds  =  extractAccountIds(data.parameters['selected-vmtas'])
    let gmail_tokens = await connect(getDbConfig(getDbType(data)),getTokens(extractedAccountIds));

    const testRecipientsList = getRecipients(data.parameters.rcpts);
    testRecipientsList.forEach(recipient => {
      let header = replaceTagsWithRandom(data.parameters['headers']) // replace tag random with random
      let body = replaceTagsWithRandom(data.parameters['body'])
      header = replaceTo(header,recipient) // replace to with email

      gmail_tokens.data.rows.forEach(token => {
            // manuplate body and header before sending a test
            results.push(sendMail(header, body, token))
        });
        
    });
    return results;
    // result = await connect(getDbConfig(getDbType(data)), stopProcess(data));
}

const sendDrop = async (data) => {
    // let results = [];
    // const extractedAccountIds  =  extractAccountIds(data.parameters['selected-vmtas'])
    // let gmail_tokens = await connect(getDbConfig(getDbType(data)),getTokens(extractedAccountIds));
    let lists = await getDataRecipients(data)
    return lists;
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