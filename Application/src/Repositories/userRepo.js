const db = require('../../../Data/db')
const UserFactory = require('../Services/userFactory')

//user repo class that can create users and manage them
class UserRepository {

    async createUser(userData) {

        const user = UserFactory.createUser(userData)

        const query = `
        INSERT INTO users
        (email, password_hash, first_name, last_name, role, campus_id)
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING *
        `

        const result = await db.query(query, [
            user.email,
            user.passwordHash,
            user.firstName,
            user.lastName,
            user.role,
            user.campusId
        ])

        return UserFactory.createUser(result.rows[0])

    }

    async getUserByEmail(email) {

        const result = await db.query(
            `SELECT * FROM users WHERE email=$1`,
            [email]
        )

        if (!result.rows.length) return null

        return UserFactory.createUser(result.rows[0])

    }

}

module.exports = new UserRepository()