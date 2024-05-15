const { Pool } = require('pg');

class Database {
    constructor() {
        if (!Database.instance) {
            this.pool = new Pool({
                user: 'admin',
                host: 'localhost',
                database: 'ir_system',
                password: 'F#7ax@dq3B9UQu8nVjcGWLDKzJ',
                port: 5432, // default port for PostgreSQL
            });
            Database.instance = this;
        }

        return Database.instance;
    }

    async query(text, params) {
        const start = Date.now();
        const res = await this.pool.query(text, params);
        const duration = Date.now() - start;
        console.log('executed query', { text, duration, rows: res.rowCount });
        return res;
    }

    async getClient() {
        const client = await this.pool.connect();
        const query = client.query;
        const release = client.release;

        // set a timeout of 5 seconds, after which we will log this client's last query
        const timeout = setTimeout(() => {
            console.error('A client has been checked out for more than 5 seconds!');
            console.error(`The last executed query on this client was: ${client.lastQuery}`);
        }, 5000);

        // monkey patch the query method to keep track of the last query executed
        client.query = (...args) => {
            client.lastQuery = args;
            return query.apply(client, args);
        };

        client.release = () => {
            // clear our timeout
            clearTimeout(timeout);

            // set the methods back to their old versions
            client.query = query;
            client.release = release;
            return release.apply(client);
        };

        return client;
    }
}

const instance = new Database();
Object.freeze(instance);

module.exports = instance;
