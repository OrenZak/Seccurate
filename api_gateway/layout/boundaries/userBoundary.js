class UserBoundary {

    constructor(username, password, role) {
        this._username = username;
        this._password = password;
        this._role = role;
    }

    get username() {
        return this._username;
    }

    set username(value) {
        this._username = value;
    }

    get password() {
        return this._password;
    }

    set password(value) {
        this._password = value;
    }

    get role() {
        return this._role;
    }

    set role(value) {
        this._role = value;
    }

    serialize() {
        return this;
    }

    static deserialize(boundary) {
        return new UserBoundary(boundary.username, boundary.password, boundary.role);
    }

    static deserializeWithNoPassword(boundary) {
        return new UserBoundary(boundary.username, "", boundary.role);
    }
}

module.exports = UserBoundary;