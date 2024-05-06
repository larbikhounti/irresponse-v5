const {getDbConfig,isMultiDimensionalArray} = require('../helpers/utils.js')
const {connect} = require('../dbConnector.js')
const {refresh} = require("./refreshToken.js")

// select gmail_servers.secret, gmail_servers.client_id , gmail_users.refresh_token from gmail_servers join gmail_users on gmail_servers.id = gmail_users.server_id where gmail_servers.server_id = $1

const getServers = (selectedVmtas)=> {
   
    let accountIds = [];

    selectedVmtas.forEach(item => {
        const [accountId,] = item.split('|').map(Number);
        if (accountIds.indexOf(accountId) == -1) {
            accountIds.push(accountId);
        }
    });

    return accountIds;

}

const tokenHandler = async (selectedInboxes) => {
    //const Servers = getServers(selectedInboxes)
    
    let data = await Promise.all(getServers(selectedInboxes).map(serverId => getServersAndInboxes(serverId)))
    if (isMultiDimensionalArray(data)) {
        data = data.flat()
    }

    for (let i = 0; i < data.length; i++) {
        if (data[i]['refresh_token'].length > 30) {
            refresh(data[i]['client_secret'],data[i]['refresh_token'],data[i]['client_id'],data[i]['id'])
        }
    }
   

 
}


const getServersAndInboxes = async (server_id) => {
    const query = {
        text: `select gmail_servers.client_secret, gmail_servers.client_id , gmail_users.refresh_token, gmail_users.id from gmail_servers join gmail_users on gmail_servers.id = gmail_users.gmail_server_id where gmail_servers.id = ${server_id}`,
        values: [],
    }
        return await connect(getDbConfig('system'), query).then(result => result.data.rows);
    
}





module.exports = {tokenHandler }