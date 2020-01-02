class UserEntity {
    constructor(username, salt, passwordHash, admin) {
        this.username = username;
        this.salt = salt;
        this.passwordHash = passwordHash;
        this.admin = admin;
    }

    getUsername() {
        return this.username;
    }

    setUsername(username) {
        this.username = username;
    }

    getSalt() {
        return this.salt;
    }

    setSalt(salt) {
        this.salt = salt;
    }

    getPasswordHash() {
        return this.passwordHash;
    }

    setPasswordHash(passwordHash) {
        this.passwordHash = passwordHash;
    }

    getAdmin(){
        return this.admin;
    }

    setAdmin(admin){
        this.admin = admin;
    }
}

module.exports = UserEntity;