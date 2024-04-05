const Pool = require('pg').Pool


 const connect = async (config,query) =>{
  let result = {success : true};
      try {
        const pool = new Pool({
          host: config.host,
          database: config.database,
          user:config.username ,
          password: config.password,
          port: config.port,
      });

      const client = await pool.connect();
      try {
        result.data =  await client.query(query);
      } finally {
          // Release client back to the pool
         client.release();
      }
      
      // Close the pool (if needed)
      await pool.end();

    } catch (error) {
      result.success = false
      result.error = error
    }

    return result
    }

  

   module.exports = {
    connect
  };

   