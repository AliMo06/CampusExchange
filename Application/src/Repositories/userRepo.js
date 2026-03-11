const db = require('../../../Data/db');

class UserRepository {

    async createUser(email, passwordHash, firstName, lastName, campusId) {

        const query = `
        INSERT INTO users(email, password_hash, first_name, last_name, campus_id)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING user_id
        `;

        const result = await db.query(query, [
            email,
            passwordHash,
            firstName,
            lastName,
            campusId
        ]);

        return result.rows[0];
    }

    async getUserByEmail(email) {

        const query = `SELECT * FROM users WHERE email=$1`;

        const result = await db.query(query, [email]);

        return result.rows[0];
    }

}

module.exports = new UserRepository();