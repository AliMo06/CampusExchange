//user class model for easy factory implementation
class User {

    constructor(userId, email, passwordHash, firstName, lastName, role, campusId) {

        this.userId = userId
        this.email = email
        this.passwordHash = passwordHash
        this.firstName = firstName
        this.lastName = lastName
        this.role = role
        this.campusId = campusId

    }

}

module.exports = User