const {connect} = require('./dbConnector')
const {getDbType, getDbConfig, ArrayToInt,ProcessKiller} = require('./helpers/utils')





const processHandler =  async (data) => {
    let result;
    switch (data.parameters['action']) {
        case 'stop':
              await connect(getDbConfig(getDbType(data)),stopProcess(data));
              result = ProcessKiller(process.pid)
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