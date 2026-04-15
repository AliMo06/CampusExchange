const User = require('../Middleware/User')

class UserFactory {

    static createUser(data) {

        return new User(
            data.user_id || null,
            data.email,
            data.password_hash,
            data.first_name,
            data.last_name,
            data.role || "student",
            data.campus_id,
            data.bio,
            data.is_active
        )

    }

}

module.exports = UserFactory