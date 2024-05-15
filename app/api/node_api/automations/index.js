const db = require('./src/db.js');
const refresh = require('./src/refreshToken.js')

async function getUsers() {
    try {
        // const res = await db.query('SELECT NOW()');
        // console.log(res.rows[0]);

        const client = await db.getClient();
        try {
            await client.query('BEGIN');
            const queryText = `select
             gmail_servers.client_id ,
             gmail_servers.client_secret, 
             gmail_users.access_token, 
             gmail_users.refresh_token, 
             gmail_users.id,
             gmail_users.email
             from admin.gmail_servers join admin.gmail_users on admin.gmail_servers.id =  admin.gmail_users.gmail_server_id `;
            const res = await client.query(queryText, []);
            const rows = res.rows;
            await client.query('COMMIT');
             await refreshToken(rows)
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

async function refreshToken(users) {
 //   console.log(users[0].access_token)
   // const parsedUsers = JSON.parse(users)
    for (let index in users) {
    let  user = users[index]
    await refresh(user)
    
    }

}

getUsers()