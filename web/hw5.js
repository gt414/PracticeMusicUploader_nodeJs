class MusicInfo {
    constructor({ musicName, fileSize, fileName, url }) {
        this.musicName = musicName;
        this.fileSize = fileSize;
        this.fileName = fileName;
        this.url = url;
    }
}

// when window Loaded
$(window).on('load', function () {
    showList()
    $('#uploadInput:file').change(handleFile);
});

var musicInfos = []
var titles = ['歌名', '檔案大小', '檔案名稱', '']

// 顯示從 server 來的清單
function showList() {
    $.getJSON("api/musicList", function (result) {
        if (result.length > 0) {
            createTable(result);
        } else {
            showNoData();
        }
    });
}

// 如果沒有任何音樂就用這個 function
function showNoData() {
    $('#musicList td')[0].innerHTML = "沒有任何歌曲";
}

// 將清單用 table 顯示出來
function createTable(result) {

    musicInfos = result.map(item => new MusicInfo(item));

    var thead = $('#musicList thead');
    thead.empty();

    for (i = 0; i < titles.length; i++) {
        thead.append($("<th />", { html: titles[i] }));
    }

    var tbody = $('#musicList tbody');
    tbody.empty();

    for (var i in musicInfos) {
        var tr = $("<tr />");
        tr.append($("<td />", { html: musicInfos[i].musicName, class: 'musicName' })[0].outerHTML);
        tr.append($("<td />", { html: musicInfos[i].fileSize, class: 'fileTD' })[0].outerHTML);
        tr.append($("<td />", { html: musicInfos[i].fileName, class: 'fileTD' })[0].outerHTML);
        var button = $("<button />", { html: '播放', class: 'playButton', id: 'button' + i });
        tr.append($("<td />", { html: button[0].outerHTML })[0].outerHTML);
        tbody.append(tr);

        $('#button' + i).on("click", function () {
            playButtonDidClicked(this);
        });
    }
}

// 播放音樂
function playButtonDidClicked(button) {
    var i = button.id.replace('button', '');
    var musicInfo = musicInfos[i];
    var div = $('#musicPlayer')
    div.empty();
    var audio = new Audio;
    audio.setAttribute('autoplay', 'autoplay');
    audio.setAttribute('controls', true);
    var source = document.createElement('source');
    source.src = musicInfo.url;
    audio.append(source)
    div.append(audio);
}

// 上傳使用者選擇的音樂以及名稱
function uploadMusic() {
    var file = $('#uploadInput')[0].files[0]
    var musicName = $('#musicNameInput')[0].value
    if (musicName == '') { musicName = file.name.split('.').slice(0, -1).join('.') }

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        var musicInfo = {
            "musicName": musicName,
            "file": reader.result
        }
    
        $.ajax({
            url: 'api/uploadMusic',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(musicInfo),
            success: function (data) {
                alert(data);
                window.location.reload(false); 
            },
            error: function () {
                alert('unknown error.');
                window.location.reload(false); 
            }
        });
    };
    reader.onerror = function (error) {
        alert('unknown error.');
        window.location.reload(false); 
    };
}

// 選擇音樂檔案
function handleFile(e) {
    var fileName = e.target.files[0].name;

    var uploadDiv = $('#uploadMusic')
    uploadDiv.empty();

    var label = $('<p/>').attr({ id: 'uploadMusicNameLabel', class: 'uploadBlock' }).text(fileName);
    var input = $('<input/>').attr({ type: 'text', id: 'musicNameInput', class: 'uploadBlock', placeholder: '請輸入音樂名稱' });
    var uploadButton = $('<button/>').attr({ id: 'uploadButton' }).text('上傳');
    uploadButton.click(uploadMusic);
    uploadDiv.append(input, label, uploadButton);
}
