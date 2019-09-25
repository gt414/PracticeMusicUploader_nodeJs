var fs = require('fs');
var music = require("./music");
var path = require('path');

const webPath = './web/';

// 根目錄就直接 show 作業
function home(req, res) {
    var html = fs.readFileSync(webPath + "hw5.html");
    res.writeHeader(200, { "Content-Type": "text/html; charset=utf-8" });
    res.write(html);
    res.end();
}

// 撈取清單的 api
function musicListAPI(req, res) {
    var json = music.getMusicJSON()
    var newJson = json.map(info => new Object({'musicName': info.musicName, 'fileSize': info.fileSize, 'fileName': info.fileName, 'url': 'music/' + info.fileName}) );
    res.writeHeader(200, { "Content-Type": "application/json; charset=utf-8" });
    res.write(JSON.stringify(newJson));
    res.end();
}

// 上傳音樂的 api
function uploadMusicAPI(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        res.writeHeader(200, { "Content-Type": "text/html; charset=utf-8" });
        var musicInfoJson = JSON.parse(body)
        music.saveMusic(musicInfoJson.file, musicInfoJson.musicName);
        res.end('上傳成功');
    });
}

// 處理一般的請求
function getResource(pathName, res) {
    try {
        var resource = fs.readFileSync(webPath + pathName.substr(1));

        var ext = path.extname(pathName);
        var contentType = {
            '.html': 'text/html; charset=utf-8',
            '.ico': 'image/x-icon',
            '.jpg': 'image/jpeg',
            '.png': 'image/png',
            '.css': 'text/css',
            '.js': 'text/javascript; charset=utf-8',
            '.json': 'application/json; charset=utf-8',
            '.mp3': 'audio/mpeg'
        }

        res.writeHead(200, { "Content-Type": contentType[ext] });
        res.write(resource);
    } catch (err) {
        console.log("404 Not Found " + pathName);
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
    }
    res.end();
}

exports.home = home;
exports.musicListAPI = musicListAPI;
exports.getResource = getResource;
exports.uploadMusicAPI = uploadMusicAPI;