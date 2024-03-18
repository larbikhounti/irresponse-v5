const {connect} = require('./dbConnector')
const {getDbType, getDbConfig} = require('./helpers/utils')




// find the drop by id 
// do the action
const handleProcess =  async (data) => {
   const result = await connect("d","SELECT NOW()");
    // Call the function and handle the result
   return result
    
    }


module.exports = {
    handleProcess
}