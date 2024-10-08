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
    replaceContentTransferEncoding,
    replaceSender,
    refreshAccessToken
} = require('./helpers/utils')
const {tokenHandler} = require('./automations/tokenHandler.js')
const { setTimeout } = require("node:timers/promises")
const RunQueue = require('run-queue');
// Create a new run-queue with a specified concurrency limit (e.g., 10)
const queue = new RunQueue({ maxConcurrency: 100 });

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

const sendTests = async (data,status = false , database = 'system') => {
    if(!status){
        await  tokenHandler(data.parameters['selected-vmtas'])
    }
    
    let results = [];
    const extractedAccountIds = extractAccountIds(data.parameters['selected-vmtas'])
    
    let gmail_users = await connect(getDbConfig(status?'system':getDbType(data)), getTokens(extractedAccountIds));
    
    //return gmail_users
    const testRecipientsList = getRecipients(data.parameters.rcpts);
    testRecipientsList.forEach( async recipient => {
        let header =  replaceTagsWithRandom(data.parameters['headers']) // replace tag random with random
        let body =  replaceTagsWithRandom(data.parameters['body'])
        let headerRandom =  replaceTagsWithRandom(header)
        let headerTo =  replaceTo(headerRandom, recipient) // replace to with email
       
        gmail_users.data.rows.forEach(async user => {
            let header_sender = await replaceSender(headerTo , user.email )
            // manuplate body and header before sending a test
           results.push(sendMail(header_sender, body, user.access_token))
        });

    });
    return Promise.resolve(results) ;
    // result = await connect(getDbConfig(getDbType(data)), stopProcess(data));
}

const sendDrop = async (data) => {  
   
   // await  tokenHandler(data.parameters['selected-vmtas'])
 
    
    let dataCount = data.parameters['data-count']
    let dataStart = data.parameters['data-start']
    let processid = data.parameters['process-id']
    let testAfter = data.parameters['test-after']
    let xDelay = parseInt(data.parameters['x-delay'])
    let batch = parseInt(data.parameters['batch'])
    const extractedAccountIds = extractAccountIds(data.parameters['selected-vmtas'])
    // refresh token before droping
    
    let gmail_users = await connect(getDbConfig('system'), getTokens(extractedAccountIds)).then(result => result.data.rows);
    let lists = await getDataRecipients(data)
    let slicedLists =  lists.slice(dataStart)
    //return lists
    await updateProcess(processid)
    let header = replaceTagsWithRandom(data.parameters['headers'])
    let body = replaceTagsWithRandom(data.parameters['body'])
    header = replaceCharset(header, data.parameters['creative-charset'])
    header = replaceContentType(header, data.parameters['creative-content-type'])
    header = replaceContentTransferEncoding(header, data.parameters['creative-content-transfert-encoding'])
   
    let headers = []
    let len = []
    for (let i = 0; i < dataCount; i++) {
        len.push(i)
    }

  
   let count = 0;
   let delaybatch = 0
   async function start() {
        for (const key in len) {
            count++
            delaybatch ++
           await updateProgress(processid, key)
            // // This calculates which sender is responsible for sending to the current recipient
            let senderIndex = key % gmail_users.length;
            let user = gmail_users[senderIndex];
            let recipient = slicedLists[key];
            header_sender = replaceSender(header,user.email)
            // send test after
            testAfter = parseInt(testAfter)
            if (count == testAfter) {
                // let testRecipientsList = getRecipients(data.parameters.rcpts);
                // testRecipientsList.forEach(async recipient => {
                //     //send test
                //  await sendMail(replaceTo(header_sender, recipient), body, user.access_token)
              //  await sendTests(data , true)
               sendTests(data , true);
                    count = 0
    
                
            }
            if(delaybatch == batch ){
                await setTimeout(xDelay)
                delaybatch = 0
            }
            
           //await setTimeout(xDelay)
            sendMail(replaceTo(header, recipient.email), body, user.access_token);
          // await sendMail(replaceTo(header, recipient.email), body, user.access_token);
    
        }
    }
    await start()
    
    // Run the queue
   
    //github
    setInterval(()=>console.log('hello'),3000)
    // return headers

}

const getTokens = (extractedAccountIds) => {
    var params = [];
    for (var i = 1; i <= extractedAccountIds.length; i++) {
        params.push('$' + i);
    }
    const query = {
        text: "select access_token, email from  admin.gmail_users  WHERE id IN (" + params.join(',') + ")",
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