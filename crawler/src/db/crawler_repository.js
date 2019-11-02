class CrawlerRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createTable(mainUrl) {
    const domain = createTableName(mainUrl);
    const sql = `CREATE TABLE IF NOT EXISTS ${domain} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          url TEXT,
          hash BLOB,
          has_cookie INTEGER)`;
    return this.dao.run(sql);
  }

  /**
   *
   * @param {The associated domain, represent the db name} mainUrl
   * @param {Should contain the relevant url, hash and has_cookie props} data
   */
  insert(mainUrl, data) {
    const table_name = createTableName(mainUrl);
    return this.dao.run(
      `INSERT INTO ${table_name} (url, hash, has_cookie)
            VALUES (?, ?, ?)`,
      [data.url, data.hash, data.has_cookie]
    );
  }

  getAll(mainUrl) {
    const table_name = createTableName(mainUrl);
    return this.dao.all(`SELECT * from ${table_name}`);
  }
}

function extractDomain(url) {
    return url.replace("http://", "").replace("https://", "").split(/[/?#]/)[0].replace(/[.]/g, "");
}

function createTableName(url) {
    return `table_${extractDomain(url)}`;
}

module.exports = CrawlerRepository;
