function extractDomain(url) {
    return url.replace("http://", "").replace("https://", "").split(/[/?#]/)[0];
}

module.exports = {
    extractDomain
}