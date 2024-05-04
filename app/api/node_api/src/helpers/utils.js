const { connect } = require('../dbConnector')
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
        case 'clients':
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

const ArrayToInt = (arrayOfStrings) => {
    const arrayOfIntegers = arrayOfStrings.map(str => parseInt(str));
    return arrayOfIntegers;
}

const getRecipients = (stringOfRecipients) => {
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

const replaceTo = (header, to) => {
    const Regex = /\[email\]/g;
    return JSON.parse(JSON.stringify(header).replace(Regex, to));
}

const replaceCharset = (header, charset) => {
    const Regex = /\[charset\]/g;
    return JSON.parse(JSON.stringify(header).replace(Regex, charset));
}

const replaceContentType = (header, contentType) => {
    const Regex = /\[content_type\]/g;
    return JSON.parse(JSON.stringify(header).replace(Regex, contentType));
}

const replaceContentTransferEncoding = (header, contentEncoding) => {
    const Regex = /\[content_transfer_encoding\]/g;
    return JSON.parse(JSON.stringify(header).replace(Regex, contentEncoding));
}

const replaceSender = (header, sender) => {
    const senderRegex = /\[sender\]/g;
    return JSON.parse(JSON.stringify(header).replace(senderRegex, sender));
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

const getDataRecipients = async (data) => {

    let tables
    tables = await connect(getDbConfig('system'), getTables(data));
    tablesData = tables.data.rows.map(row => row.table_name);
    let dataList = (await getDataList(tablesData, tables.data.rows[0].table_schema))
    let suppretionList = (await getSupressionList(tables, data))

    return filterEmailList(dataList, suppretionList);
}

const getTables = (data) => {
    const placeholders = data.parameters['lists'].map((_, index) => '$' + (index + 1)).join(',');
    const lists = data.parameters['lists'].map(list => parseInt(list))
    const query = {
        text: `SELECT id, table_name , table_schema
        FROM lists.data_lists
        WHERE id IN (${placeholders})`,
        values: lists,
    }
    return query;
}

const getDataList = async (tables, schema) => {
    let data = []
    let resolvedData = await Promise.all(tables.map(async table => {
        const query = {
            text: `SELECT email, email_md5
             FROM ${schema}.${table}`,
            values: [],
        }
        return await connect(getDbConfig('clients'), query)
    }));
    // data.push(resolvedData)
    resolvedData.forEach(list => {
        list.data.rows.forEach(row => {
            data.push(row)
        })
    })
    return data.flat()
}

const getSupressionList = async (selectedDataTables, requestData) => {
    let SupressionList = []
    let affiliateNetworkId = requestData.parameters['affiliate-network-id']

    let offerId = await getProductionId(requestData.parameters['offer-id']).then(result => result.data.rows[0].production_id)
    //return selectedDataTables.data.rows.length
    //return  `SELECT email_md5 FROM suppressions.sup_list_${affiliateNetworkId}_${offerId}_${selectedDataTables.data.rows[0].id}`
    for (let index = 0; index < selectedDataTables.data.rows.length; index++) {
        try {
            const query = {
                text: `SELECT email_md5 FROM suppressions.sup_list_${affiliateNetworkId}_${offerId}_${selectedDataTables.data.rows[index].id}`,
                values: [],
            }
            let List = await connect(getDbConfig('clients'), query).then(result => result.data.rows);
            if (List.length != 0) {
                SupressionList.push(List)
            }
        } catch (error) {

        }

    }
    return SupressionList.flat()
}

const filterEmailList = (dataList, suppretionList) => {
    return removeSuppressedEmails(dataList, suppretionList);
}

const removeSuppressedEmails = (datalist, suppressionList) => {
    if (suppressionList.length != 0) {
        return datalist.filter(data => {
            return !suppressionList.some(suppression => suppression.email_md5 === data.email_md5);
        });
    }
    return datalist 

};


const getProductionId = async (id) => {
    const query = {
        text: `SELECT production_id
        FROM affiliate.offers WHERE id = ${id}`,
        values: [],
    }
    return await connect(getDbConfig('system'), query);
}

const updateProgress = async (processId, index) => {
    const query = {
        text: `update production.gmail_processes Set progress = ${index} WHERE id = ${processId}`,
        values: [],
    }
    return await connect(getDbConfig('system'), query);
}

const updateProcess = async (processId) => {
    const query = {
        text: `update production.gmail_processes Set process_id = ${process.pid} WHERE id = ${processId}`,
        values: [],
    }
    return await connect(getDbConfig('system'), query);
}



function isMultiDimensionalArray(arr) {
    if (!Array.isArray(arr)) {
        return false; // Not an array
    }

    // Check if any element of the array is also an array
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            return true; // Found a nested array
        }
    }

    return false; // No nested array found
}


const updateAccessToken = async (token, user_id) => {
    const query = {
        text: `UPDATE admin.gmail_users SET access_token = $1 WHERE id = $2`,
        values: [token, user_id]
    }
    return await connect(getDbConfig('system'), query);
}










module.exports = {
    getDbType,
    getDbConfig,
    ArrayToInt,
    getRecipients,
    decodeData,
    extractAccountIds,
    replaceTo,
    replaceTagsWithRandom,
    replaceSender,
    getDataRecipients,
    updateProgress,
    updateProcess,
    replaceCharset,
    replaceContentType,
    replaceContentTransferEncoding,
    isMultiDimensionalArray,
    updateAccessToken
}

