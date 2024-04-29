const {
    sendMail
} = require('./MailSender')
const {
    connect
} = require('./dbConnector')
const {
    getRecipients,
    extractAccountIds,
    replaceTo,
    replaceTagsWithRandom,
    getDbConfig,
    getDbType,
    getDataRecipients,
    updateProgress,
    updateProcess,
    replaceCharset,
    replaceContentType,
    replaceContentTransferEncoding
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
    const extractedAccountIds = extractAccountIds(data.parameters['selected-vmtas'])
    let gmail_tokens = await connect(getDbConfig(getDbType(data)), getTokens(extractedAccountIds));

    const testRecipientsList = getRecipients(data.parameters.rcpts);
    testRecipientsList.forEach(recipient => {
        let header = replaceTagsWithRandom(data.parameters['headers']) // replace tag random with random
        let body = replaceTagsWithRandom(data.parameters['body'])
        header = replaceTo(header, recipient) // replace to with email

        gmail_tokens.data.rows.forEach(token => {
            // manuplate body and header before sending a test
            results.push(sendMail(header, body, token))
        });

    });
    return results;
    // result = await connect(getDbConfig(getDbType(data)), stopProcess(data));
}

const sendDrop = async (data) => {
    let dataCount = data.parameters['data-count']
    let dataStart = data.parameters['data-start']
    let processid = data.parameters['process-id']
    let testAfter = data.parameters['test-after']
    const extractedAccountIds = extractAccountIds(data.parameters['selected-vmtas'])
    let gmail_tokens = await connect(getDbConfig('system'), getTokens(extractedAccountIds)).then(result => result.data.rows);
    
    let lists = await getDataRecipients(data)
    //return lists
    await updateProcess(processid)
    let header = replaceTagsWithRandom(data.parameters['headers'])
    let body = replaceTagsWithRandom(data.parameters['body'])
    header = replaceCharset(header, data.parameters['creative-charset'])
    header = replaceContentType(header, data.parameters['creative-content-type'])
    header = replaceContentTransferEncoding(header, data.parameters['creative-content-transfert-encoding'])
    let count = 0;
    let headers = []
    for (let i = dataStart; i < dataCount; i++) {
        count++
        await updateProgress(processid, i)
        // // This calculates which sender is responsible for sending to the current recipient
        let senderIndex = i % gmail_tokens.length;
        let sender = gmail_tokens[senderIndex];
        let recipient = lists[i];
        // send test after
        testAfter = parseInt(testAfter)
        if (count == testAfter) {
            let testRecipientsList = getRecipients(data.parameters.rcpts);
            testRecipientsList.forEach(recipient => {
                //send test
                sendMail(replaceTo(header, recipient), body, sender)
                count = 0
            });
        }
        

        sendMail(replaceTo(header, recipient.email), body, sender);

    }
    return headers

}

const getTokens = (extractedAccountIds) => {
    var params = [];
    for (var i = 1; i <= extractedAccountIds.length; i++) {
        params.push('$' + i);
    }
    const query = {
        text: "select access_token from  admin.gmail_users  WHERE id IN (" + params.join(',') + ")",
        values: extractedAccountIds,
    }
    return query;
}

// get mail account info
const getMailAccount = () => {

}

module.exports = {
    mailHandler
}