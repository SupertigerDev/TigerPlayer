
function getAllMusic() {
    spinner.fadeIn();
    var append = "";
    var musicFound = 0;
    fs.readdir(store.get("configuration").musicFolderPath[0], function (err, items) {
        asyncLoop(items, function (item, next) {
            if (typeof item == "undefined"){browseMusic(); return;}
            if (item.endsWith(".mp3")) {
                if (!fs.lstatSync(store.get("configuration").musicFolderPath[0] + "/" + item).isDirectory()){
                    musicFound++;
                }
                getAlbumInformation(item, function (cb) {
                    append += cb;
                    next();
                })

            }else {
                next();
            }

        }, function (err) {
            if (err) {
                console.error('Error: ' + err.message);
                return;
            }
            console.log('Finished!');
            numOfMusic.html(musicFound)

        if (musicFound <= 0) {
            browseMusic()
        }



            final = $(append).hide()
            $(musicList).append(final);
            spinner.fadeOut(300, function(){
                final.fadeIn(300);
            })

        });

    });
}
function browseMusic(){
    mainContainer.fadeOut();
    firstStartScreen.css("display", "block")
    mainContainer.animate({
        opacity: 0
    }, 300)
    firstStartScreen.animate({
        opacity: 1
    }, 300)
}

function getAlbumInformation(item, cb) {
    jsmediatags.read(store.get("configuration").musicFolderPath[0] + "/" + item, {
        onSuccess: function (tag) {

            imageUri = getAlbumArt(tag.tags.picture)
            if (typeof tag.tags.title == "undefined"){
                title = item
            }else{
                title = tag.tags.title
            }
            if (typeof tag.tags.artist == "undefined"){
                artist = ""
            }else{
                artist = tag.tags.artist
            }

            var final = '<div class="musicAppend" onClick="musicClicked(this)"><img class="musicImage" src="' + imageUri + '"></img><div class="information"><p>' + title + '</p><p>' + artist + '</p><p>0:00</p></div></div>'
            cb(final)
        },
        onError: function (error) {
            // handle error
            if (error.type == "tagFormat"){
                var final = '<div class="musicAppend" onClick="musicClicked(this)"><img class="musicImage" src="./img/TigerLogo1.png"></img><div class="information"><p>' + item + '</p><p></p><p>0:00</p></div></div>'
                cb(final)
            }

        }
    });
}

function getAlbumArt(picture) {
    if (typeof picture == "undefined")
        return "./img/TigerLogo1.png"

    var base64String = "";
    for (var i = 0; i < picture.data.length; i++) {
        base64String += String.fromCharCode(picture.data[i]);
    }
    return "data:" + picture.format + ";base64," + window.btoa(base64String);

}