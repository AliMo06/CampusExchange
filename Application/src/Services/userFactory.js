const User = require('../Middleware/User')

//user factory that creates a new user utilizing the user model
class UserFactory {

    static createUser(data) {

        return new User(
            data.user_id || null,
            data.email,
            data.password_hash,
            data.first_name,
            data.last_name,
            data.role || "student",
            data.campus_id
        )

    }

}

module.exports = UserFactory