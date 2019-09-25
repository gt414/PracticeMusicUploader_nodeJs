var http = require("http");
var url = require("url");
var router = require("./route");
 
// 當接到請求的 callback
function onRequest(req, res) {
  var pathname = url.parse(req.url).pathname;
  router.route(pathname, req, res);
}
 
// 啟動 http server
function runHTTPServer() {
    var port = 8080
    http.createServer(onRequest).listen(port);
    console.log("Server has started to listen at port: " + port);
}

exports.run = runHTTPServer;
