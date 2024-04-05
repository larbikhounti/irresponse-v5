const {exec} = require('child_process');
const {connect} = require('./dbConnector')
const {getDbType, getDbConfig, ArrayToInt} = require('./helpers/utils')





const processHandler =  async (data) => {
    let result;
    switch (data.parameters['action']) {
        case 'stop':
              await connect(getDbConfig(getDbType(data)),stopProcess(data));
              result = ProcessKiller(data)
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

const ProcessKiller = async (data) =>{

    const query = {
        text: `select process_id from production.gmail_processes WHERE id = ${data.parameters['processes-ids'][0]}`,
        values: [],
    }
    let process_id =  await connect(getDbConfig('system'),query).then(result => result.data.rows[0].process_id);
// Execute the ps command to list running processes
exec(`sudo kill ${process_id} `, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing ps command: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`Error in ps command output: ${stderr}`);
      return;
    }
    stopProcess(data)

})

}


module.exports = {
    processHandler
}