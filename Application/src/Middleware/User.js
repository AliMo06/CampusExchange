class User {

    constructor(userId, email, passwordHash, firstName, lastName, role, campusId, bio, isActive) {

        this.userId = userId
        this.email = email
        this.passwordHash = passwordHash
        this.firstName = firstName
        this.lastName = lastName
        this.role = role
        this.campusId = campusId
        this.bio = bio || null
        this.isActive = isActive

    }

}

module.exports = User