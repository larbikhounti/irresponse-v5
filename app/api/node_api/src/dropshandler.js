const {connect} = require('./dbConnector')
const {getDbType, getDbConfig, ArrayToInt} = require('./helpers/utils')





const processHandler =  async (data) => {
    let result;
    switch (data.parameters['action']) {
        case 'stop':
             result = await connect(getDbConfig(getDbType(data)),stopProcess(data));
            break;
    
        default:
            break;
    }
   return result
    
    }

const stopProcess = (data) =>{
 const  arrayOfIntegers = ArrayToInt(data.parameters['processes-ids'])
 const query = {
    text: "UPDATE production.gmail_processes SET status = 'stopped' WHERE id IN ($1);" ,
    values: arrayOfIntegers,
  }
  return query;
}

module.exports = {
    processHandler
}