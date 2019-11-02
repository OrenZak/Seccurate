class URLBoundary {
    constructor(url) {
        this.url = url;
    }

    get URL() {
        return this.url
    }

    set URL(url) {
        this.url = url;
    }

    serialize() {

    }

    static deserialize(urlBoundary) {
        var deserialized = JSON.parse(urlBoundary);
        return new URLBoundary(deserialized.url);
    }
}

module.exports = URLBoundary;