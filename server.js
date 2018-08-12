var express = require('express');
var app = express();
var path = require('path');

const buildPath = path.resolve(__dirname, 'build');

app.use(express.static('build'));

app.get('/', function(req, res) {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(8080);
