const MongoClient = require('mongodb').MongoClient

// Note: A production application should not expose database credentials in plain text.
// For strategies on handling credentials, visit 12factor: https://12factor.net/config.
const PROD_URI = "mongodb://root:app321@192.168.16.15:30013/test?authSource=admin"
const MKTG_URI = "mongodb://root:app321@192.168.16.15:30013/test?authSource=admin"

console.log(PROD_URI)
function connect(url) {
  return MongoClient.connect(url).then(client => client.db())
}

module.exports = async function() {
  let databases = await Promise.all([connect(PROD_URI), connect(MKTG_URI)])

  return {
    production: databases[0],
    marketing: databases[1]
  }
}
