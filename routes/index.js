var async = require('async');

module.exports = function(app, dbs) {

  app.get('/health-old', function(req, res) {
    console.log(dbs)
    //dbs.production.collection('test').find({}).toArray(function (err, docs) {    
    dbs.adminCommand( { listDatabases: 1 } ).toArray(function (err, docs) {
      if (err) {
        console.log(err);        
        res.status(503).end();        
      } else {
        res.json(docs);
      }
    });
  });

  app.get('/health', (req, res) => {
    dbs.production.collection('test').find({}).toArray((err, docs) => {
      if (err) {
        console.log(err)
        res.status(503).end();
      } else {
        res.json(docs)
      }
    })
  })


  app.get('/timesensitive', function(req, res) {
    var q = dbs.appdb.collection('test').find({});
    var query = async.timeout(function(cb) { q.toArray(cb) }, 5000);
    query(function (err, docs) {
      if (err && err.code == 'ETIMEDOUT') {
        res.status(503).end();
      } else if (err) {
        res.error(err);
      } else {
        res.json(docs);
      }
    });
  });

  return app;
};
