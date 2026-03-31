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

    //Function to pull all users from the database, 
    async getAllUsers() {
        const result = await db.query(
            `SELECT * FROM users`
        )

        return result.rows.map(row => UserFactory.createUser(row)) //Array of user objects
    }

    //Funtion to update a user by ID 
    async updateUser(userId, updateObject) {
        const fields = Object.keys(updateObject)
        const values = Object.values(updateObject)

        //Map the Fields to a string that will be used in the SQL query to update the user
        const setClause = fields
            .map((field, index) => `${field} = $${index + 1}`)
            .join(', ')

        //SQL Query that returns the updated user info
        const result = await db.query(
            `UPDATE users SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`,
            [...values, userId]
        )

        if (!result.rows.length) return null //If nothing was there, return null

        return UserFactory.createUser(result.rows[0]) //Return
    }

    //Function to delete a user by ID
    async deleteUser(userId) {

        //SQL query to delete user row based on userID
        const result = await db.query(
            `DELETE FROM users WHERE id = $1 RETURNING *`,
            [userId]
        )

        if(!results.rows.length) return null //If nothing was deleted, reutrn null

        return UserFactory.createUser(result.rows[0]) //Return
    }

}

module.exports = new UserRepository()