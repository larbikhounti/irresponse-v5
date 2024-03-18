const {getDbConfig} = require('./helpers/utils')
const Pool = require('pg').Pool


 const connect = async (config,query) =>{
  let result = {success : true};
      //  return  new Client({
      //       host: config.host,
      //       database: config.database,
      //       user: config.username,
      //       password: config.password,
      //       port: config.port,
      //     })
      try {
        const pool = new Pool({
          host: "localhost",
          database: "ir_system",
          user: "admin",
          password: "admin123",
          port: 5432,
      });

      const client = await pool.connect();
      try {
          await client.query(query);
      } finally {
          // Release client back to the pool
          client.release();
      }
      
      // Close the pool (if needed)
      await pool.end();

    } catch (error) {
      result.success = false
      return result;
    }

    return result
    }

  

   module.exports = {
    connect
  };

   