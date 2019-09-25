var fs = require("fs");

// 儲存當前音樂的資訊
const jsonName = "musics.json";

class MusicInfo {
    constructor({ musicName, fileSize, fileName }) {
        this.musicName = musicName;
        this.fileSize = fileSize;
        this.fileName = fileName;
    }
}

// 將 frontend 傳來的 base64 data 轉成音樂的檔案存起來
function saveMusic(base64Data, musicName) {
    var fileDataDecoded = Buffer.from(base64Data, 'base64');
    var fileName = getRandomFileName() + ".mp3";
    var size = fileDataDecoded.byteLength / 10000
    size = Math.trunc(size)
    size = size / 100
    fs.writeFile("./web/music/" + fileName, fileDataDecoded, function (err) { });
    var info = { musicName: musicName, fileSize: size + ' mb', fileName: fileName }
    var all = getMusicJSON()
    all.push(info)
    saveJSON(all);
}

// 將更新後的清單純起來
function saveJSON(all) {
    let str = JSON.stringify(all)
    fs.writeFile("./server/" + jsonName, str, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

// 讀取清單
function readMusicJSONFile() {
    return fs.readFileSync("./server/" + jsonName);
}

// 讀取 json 格式的清單
function getMusicJSON() {
    var jsonFile = readMusicJSONFile()
    var jsonObj = JSON.parse(jsonFile);
    return jsonObj
}

// 給定隨機的檔案名稱
function getRandomFileName() {
    return Math.floor(Math.random() * 9000) + 1000;
}

exports.readMusicJSONFile = readMusicJSONFile;
exports.getMusicJSON = getMusicJSON;
exports.saveMusic = saveMusic;