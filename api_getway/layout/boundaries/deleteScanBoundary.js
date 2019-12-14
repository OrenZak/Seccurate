class DeleteBoundary {
    constructor(id) {
        this.id = id;
    }

    get ID() {
        return this.id;
    }

    set ID(id) {
        this.id = id;
    }

    serialize() {
        return JSON.stringify(this);
    }

    static deserialize(boundary) {
        return new DeleteBoundary(boundary.id);
    }
}

module.exports = DeleteBoundary;