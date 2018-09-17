var PropertiesReader = require('properties-reader');
var fs = require("fs");
var async = require('async');
var MongoClient = require('mongodb').MongoClient;

// Note: A production application should not expose database credentials in plain text.
// For strategies on handling credentials, visit 12factor: https://12factor.net/config.
// mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
var properties = PropertiesReader('/dbinfo/dbconfig.conf');
var MONGODB_USERNAME= properties.get('MONGODB_USERNAME');
var MONGODB_HOST=properties.get('MONGODB_HOST');
var MONGODB_PORT=properties.get('MONGODB_PORT');
var MONGODB_DBNAME=properties.get('MONGODB_DBNAME');
var MONGODB_PASSWORD = fs.readFileSync("/secret/secret.txt", { "encoding": "utf8"});

var DB_URI="mongodb://"+MONGODB_USERNAME.trim()+":"+MONGODB_PASSWORD.trim()+"@"+MONGODB_HOST.trim()+":"+MONGODB_PORT+"/"+MONGODB_DBNAME.trim() ;
DB_URI+='?authSource=admin';
console.log('DB_URI='+DB_URI);

function connect(url) {
  console.log('rul='+url);
  return MongoClient.connect(url,{ useNewUrlParser: true, 
    connectTimeoutMS: 1000,        
    auto_reconnect: true,
    poolSize: 15,
    minSize: 3,
    authSource: 'admin'
    },).then(client => client.db())
}

module.exports = async function() {
  let databases = await Promise.all([connect(DB_URI)])

  return {
    production: databases[0]    
  }
}


//-----
// var databases = {
  // appdb: async.apply(MongoClient.connect, DB_URI,{ useNewUrlParser: true, 
  //       connectTimeoutMS: 1000,        
  //       auto_reconnect: true,
  //       poolSize: 15,
  //       minSize: 3,
  //       authSource: 'admin'
  //   }, 
//   )  
// };

// module.exports = function (cb) {
//   async.parallel(databases, cb);
// };
