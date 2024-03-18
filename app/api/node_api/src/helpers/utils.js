
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


module.exports = {
    getDbType,
    getDbConfig,
    ArrayToInt,
    getRecipients,
    decodeData,
    extractAccountIds
  };

   