$(function () {

    const {
        dialog
    } = require('electron').remote;
    const fs = require('fs');
    const Store = require('electron-store');
    const store = new Store();

    var jsmediatags = require("jsmediatags");

    //store.delete("configuration")

    var startup = $(".startup"),
        firstStartScreen = $(".firstStart"),
        mainContainer = $(".mainContainer"),
        musicList = $(".musicList");

    startup.animate({
        opacity: 1,
        marginTop: 20
    }, 300, function () {
        setTimeout(() => {

            startup.animate({
                opacity: 0,
                marginTop: 0
            }, 300, function () {
                startup.fadeOut();
                setTimeout(() => {
                    startup.css("display", "none")
                    loadUpAnimationComplete()
                }, 500)
            });

        }, 1000)

    });

    function loadUpAnimationComplete() {

        if (typeof store.get("configuration") == "undefined") {

            firstStartScreen.animate({
                opacity: 1
            }, 300)

            $(".browseButton").click(function (e) {
                var path = dialog.showOpenDialog({
                    properties: ['openDirectory']
                });
                if (typeof path != "undefined") {
                    store.set("configuration", {
                        musicFolderPath: path
                    })
                    firstStartScreen.animate({
                        opacity: 0
                    }, 300, function () {
                        firstStartScreen.css("display", "none")
                        mainMusicScreen();
                    })
                }
            });


        } else {
            firstStartScreen.css("display", "none")
            mainMusicScreen();
        }
    }

    function mainMusicScreen() {
        mainContainer.animate({
            opacity: 1
        }, 300, function () {
            getAllMusic();
        })


    }


    function getAllMusic() {
        var filesFolders = []
        fs.readdir(store.get("configuration").musicFolderPath[0], function (err, items) {
            if (typeof items == "undefined") {
                // event.sender.send('filesSend', false)
                //return
            }
            for (var i = 0; i < items.length; i++) {
                filesFolders.push({
                    name: items[i],
                    isDirectory: fs.lstatSync(store.get("configuration").musicFolderPath[0] + "/" + items[i]).isDirectory()
                })

                var tags = {};
                jsmediatags.read(store.get("configuration").musicFolderPath[0] + "/" + items[i], {
                    onSuccess: function (tag) {
                        var picture = tag.tags.picture; // create reference to track art
                        var base64String = "";
                        for (var i = 0; i < picture.data.length; i++) {
                            base64String += String.fromCharCode(picture.data[i]);
                        }
                        var imageUri = "data:" + picture.format + ";base64," + window.btoa(base64String);
                        musicList.append('<div class="musicAppend"><img class="musicImage" src="' + imageUri + '"></img><div class="information"><p>' + tag.tags.title + '</p><p>' + tag.tags.artist + '</p><p>0:00</p></div></div>')
                        console.log(tag)
                    },
                    onError: function (error) {
                        // handle error
                        console.log(error);
                    }
                });


            }




        });
    }

})