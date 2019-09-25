var resHandler = require("./resHandler");
var path = require('path');

const apiPath = "/api/";

// 負責處理路徑要啟動不同的功能
function route(pathName, req, res) {

    var handle = {}
    handle["/"] = resHandler.home;
    handle[apiPath + "musicList"] = resHandler.musicListAPI;
    handle[apiPath + "uploadMusic"] = resHandler.uploadMusicAPI;

    var fileExtSet = new Set([".css", ".js", ".png", ".jpg", ".html", ".json", ".ico", ".mp3"]);
    var ext = path.extname(pathName);

    if (typeof handle[pathName] === 'function') {
        return handle[pathName](req, res);
    }
    else if (fileExtSet.has(ext)) {
        return resHandler.getResource(pathName, res);
    }
    else {
        console.log("404 Not Found " + pathName);
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
    }
}

exports.route = route;