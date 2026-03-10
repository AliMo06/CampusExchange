const { Pool } = require('pg');

class Database {
    constructor() {
        if (!Database.instance) {

            this.pool = new Pool({
                host: process.env.DB_HOST || "localhost",
                user: process.env.DB_USER || "postgres",
                password: process.env.DB_PASSWORD || "password",
                database: process.env.DB_NAME || "campus_exchange",
                port: 5432
            });

            Database.instance = this;
        }

        return Database.instance;
    }

    query(text, params) {
        return this.pool.query(text, params);
    }
}

const dbInstance = new Database();
Object.freeze(dbInstance);

module.exports = dbInstance;