// Import the random tag functions
const { uniqueRandomTagFunctions, randomTagFunctions } = require('./randomGenerator');
const systemFunctions = [
    'proceedTest',
    'executeProcessAction',
]

const getDbConfig = (dbtype) => {
    switch (dbtype) {
        case 'system':
            const system = require('../../../../../datasources/system.json');
            return system
        case 'client':
            const clients = require('../../../../../datasources/clients.json');
            return clients
        default:
            break;
    }

}

const getDbType = (data) => {
    // check db that we need to connect to, to precess an action
    let db;
    if (systemFunctions.indexOf(data.action) != -1) {
        db = 'system'
        return db
    } else {
        db = 'clients'
        return db;
    }
}

const ArrayToInt = (arrayOfStrings) =>{
    const arrayOfIntegers = arrayOfStrings.map(str => parseInt(str));
    return arrayOfIntegers;
}

const getRecipients  = (stringOfRecipients)=>
{
    return stringOfRecipients.split(/\r?\n/);
}

const decodeData = (data) => {
    return JSON.parse(Buffer.from(data, 'base64').toString('utf-8'))
}

// get the gmail accounts ids
const extractAccountIds = (inputArray) => {
     let accountIds = [];

    inputArray.forEach(item => {
        const [, accountId] = item.split('|').map(Number);
        accountIds.push(accountId);
    });

    return accountIds;
}

const replaceTo = (header,to) =>{
        const emailRegex = /\[email\]/g;
        return JSON.parse(JSON.stringify(header).replace(emailRegex, to));
}

// Function to replace tags in text with corresponding random tags
const replaceTagsWithRandom = (header) => {
    const HeaderAsString = JSON.stringify(header)
    // Regular expression to match tags like [a_7], [n_5], etc. ending with "_some-number]"
    const tagRegex = /\[([a-zA-Z]+_\d+)]/g;

    // Replace each tag found in the text
    return JSON.parse(HeaderAsString.replace(tagRegex, (match, tag) => {
        // Extract length from tag
        const length = parseInt(tag.split('_')[1]);
        const tagType = tag.split('_')[0]

        // Get corresponding random tag
        let randomTag;
        if (uniqueRandomTagFunctions[tagType]) {
            randomTag = uniqueRandomTagFunctions[tagType](length);
        } else if (randomTagFunctions[tagType]) {
            randomTag = randomTagFunctions[tagType](length);
        } else {
            // If tag is not recognized, return the original match
            return match;
        }
        // Return the random tag to replace the original tag in the text
        return randomTag;
    }));
};

module.exports = {
    getDbType,
    getDbConfig,
    ArrayToInt,
    getRecipients,
    decodeData,
    extractAccountIds,
    replaceTo,
    replaceTagsWithRandom
  };

   