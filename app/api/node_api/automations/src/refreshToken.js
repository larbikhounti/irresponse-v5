const axios = require('axios');
const logger = require('../logger/logger.js')
const db = require('./db.js')
const refresh = async (user) => {
    try {
        const response = await axios.post('https://oauth2.googleapis.com/token', {
            client_secret: user.client_secret,
            grant_type: 'refresh_token',
            refresh_token: user.refresh_token,
            client_id: user.client_id
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
           console.log(response.data)
           try {
            await updateUsers(response.data,user.id)
           } catch (error) {
            console.log(error)
           }
        

        }
    } catch (error) {
        let errorData = {}
        if (error) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            errorData.email = user.email
            errorData.statusText =error.response.data;
            //console.error('Headers:', error.response.headers);
            errorData.data = error.response.data;
        } else if (error.request) {
            // The request was made but no response was received
           //  console.error('Error request:', error.request);
           errorData.email = user.email
           errorData.statusText = error.response.data;
        } else {
            // Something happened in setting up the request that triggered an Error
            errorData = error
            
        }
        logger.info(JSON.stringify(errorData))
        errorData = {}
       // console.error('Config:', error.config);
    }
};


async function updateUsers(data, user_id) {
    try {
        // const res = await db.query('SELECT NOW()');
        // console.log(res.rows[0]);

        const client = await db.getClient();
        try {
            await client.query('BEGIN');
            const queryText ="UPDATE admin.gmail_users SET access_token = $1 WHERE id = $2 ";
            await client.query(queryText, [data.access_token, user_id]);
            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Error running query', err);
    }
}

module.exports = refresh
