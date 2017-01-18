var express = require('express');
var http = require("http");
var querystring = require("querystring");
var bodyParser = require('body-parser');
var translate = require("./translate.js")

var app = express();
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set('port', (process.env.PORT || 3000));





app.get('/', function(request, response) {
//response.send("lala");
  
  console.log(request.query.From);
  console.log(request.query.To);
  console.log(request.query.word);

  translate({
    from: request.query.From,
    to: request.query.To,
    query: request.query.word
  }, function(result) {
    console.log(result);  
    response.end(result);
  });

});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


