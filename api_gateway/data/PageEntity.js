
class PageEntity {
    constructor(url) {
        this.url = url;
    }

    getURL() {
        return this.url
    }

    setURL(url) {
        this.url=url
    }
}

module.exports = PageEntity